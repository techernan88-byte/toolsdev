import type { Topic } from '../../types';

export default {
  id: 'arquitectura',
  icon: '🏛️',
  title: 'Arquitectura por capas',
  description:
    'Un módulo completo como en un proyecto profesional: router (HTTP) → servicio (reglas de negocio) → repositorio (consultas a la BD). Cada capa tiene una responsabilidad y se puede testear por separado.',
  tip: 'El router no hace consultas y el servicio no conoce Request ni HTTPException: lanza excepciones del dominio (NotFoundError…) que el manejador global convierte en respuestas.',

  snippets: [
    {
      title: 'Flujo de una petición',
      lang: 'text',
      code: `PATCH /api/v1/products/7   {"price": 79}
        │
        ▼
 Middleware (CORS, logs, tiempo de respuesta)
        │
        ▼
 Router  products.py      → valida path/body con Pydantic, resuelve dependencias
        │                    (SessionDep, AdminUser)
        ▼
 Servicio  ProductService → reglas de negocio: ¿existe?, ¿precio válido?, ¿quién puede?
        │
        ▼
 Repositorio ProductRepository → select / insert / update con SQLAlchemy
        │
        ▼
 PostgreSQL
        │  si algo lanza AppError en cualquier capa…
        ▼
 exception_handler → {"code": "NOT_FOUND", "message": "Producto no encontrado"}`,
    },
    {
      title: 'Módulo "products" completo',
      files: [
        {
          name: 'app/repositories/product.py',
          lang: 'python',
          code: `from collections.abc import Sequence
from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload
from app.models.product import Product


class ProductRepository:
    """Solo acceso a datos: sin reglas de negocio."""

    def __init__(self, db: Session) -> None:
        self.db = db

    def get(self, product_id: int) -> Product | None:
        return self.db.get(Product, product_id)

    def list(self, *, search: str | None, offset: int, limit: int) -> tuple[Sequence[Product], int]:
        stmt = select(Product).options(selectinload(Product.category))
        if search:
            stmt = stmt.where(Product.name.ilike(f"%{search}%"))
        total = self.db.scalar(select(func.count()).select_from(stmt.subquery())) or 0
        items = self.db.scalars(stmt.order_by(Product.id).offset(offset).limit(limit)).all()
        return items, total

    def add(self, product: Product) -> Product:
        self.db.add(product)
        self.db.commit()
        self.db.refresh(product)
        return product

    def save(self, product: Product) -> Product:
        self.db.commit()
        self.db.refresh(product)
        return product

    def delete(self, product: Product) -> None:
        self.db.delete(product)
        self.db.commit()`,
        },
        {
          name: 'app/services/product.py',
          lang: 'python',
          code: `from app.core.exceptions import ConflictError, NotFoundError
from app.models.product import Product
from app.repositories.product import ProductRepository
from app.schemas.product import Page, ProductCreate, ProductRead, ProductUpdate


class ProductService:
    """Reglas de negocio: no sabe nada de HTTP."""

    def __init__(self, repo: ProductRepository) -> None:
        self.repo = repo

    def get(self, product_id: int) -> Product:
        product = self.repo.get(product_id)
        if product is None:
            raise NotFoundError("Producto")
        return product

    def list(self, *, page: int, size: int, search: str | None) -> Page[ProductRead]:
        items, total = self.repo.list(search=search, offset=(page - 1) * size, limit=size)
        return Page[ProductRead](items=items, total=total, page=page, size=size)

    def create(self, data: ProductCreate) -> Product:
        return self.repo.add(Product(**data.model_dump()))

    def update(self, product_id: int, data: ProductUpdate) -> Product:
        product = self.get(product_id)
        changes = data.model_dump(exclude_unset=True)
        if "stock" in changes and changes["stock"] < 0:
            raise ConflictError("El stock no puede ser negativo")
        for field, value in changes.items():
            setattr(product, field, value)
        return self.repo.save(product)

    def delete(self, product_id: int) -> None:
        self.repo.delete(self.get(product_id))`,
        },
        {
          name: 'app/api/routes/products.py',
          lang: 'python',
          code: `from typing import Annotated
from fastapi import APIRouter, Depends, Query, status
from app.api.deps import AdminUser
from app.db.session import SessionDep
from app.repositories.product import ProductRepository
from app.schemas.product import Page, ProductCreate, ProductRead, ProductUpdate
from app.services.product import ProductService


def get_product_service(db: SessionDep) -> ProductService:
    return ProductService(ProductRepository(db))


ServiceDep = Annotated[ProductService, Depends(get_product_service)]

router = APIRouter(prefix="/products", tags=["products"])


@router.get("/")
def list_products(
    service: ServiceDep,
    page: Annotated[int, Query(ge=1)] = 1,
    size: Annotated[int, Query(ge=1, le=100)] = 20,
    search: str | None = None,
) -> Page[ProductRead]:
    return service.list(page=page, size=size, search=search)


@router.get("/{product_id}")
def get_product(product_id: int, service: ServiceDep) -> ProductRead:
    return service.get(product_id)


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_product(data: ProductCreate, service: ServiceDep, _admin: AdminUser) -> ProductRead:
    return service.create(data)


@router.patch("/{product_id}")
def update_product(product_id: int, data: ProductUpdate, service: ServiceDep, _admin: AdminUser) -> ProductRead:
    return service.update(product_id, data)


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, service: ServiceDep, _admin: AdminUser) -> None:
    service.delete(product_id)`,
        },
      ],
    },
  ],
} satisfies Topic;
