import type { Topic } from '../../types';

export default {
  id: 'sqlalchemy',
  icon: '🐘',
  title: 'PostgreSQL con SQLAlchemy',
  description:
    'SQLAlchemy 2.0 es el ORM estándar de Python: defines las tablas como clases con Mapped[...] y consultas con select(). Con el driver psycopg se conecta a PostgreSQL. Aquí tienes la configuración completa y un CRUD con FastAPI.',
  tip: 'Las consultas de SQLAlchemy generan el mismo SQL que aprendiste en la categoría PostgreSQL. Activa echo=True en desarrollo para ver el SQL que se ejecuta.',

  snippets: [
    {
      title: '1. Instalación y conexión',
      files: [
        {
          name: 'terminal',
          lang: 'bash',
          code: `uv add sqlalchemy "psycopg[binary]" pydantic-settings

# PostgreSQL local con Docker
docker run --name pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=tienda -p 5432:5432 -d postgres:17`,
        },
        {
          name: '.env',
          lang: 'env',
          code: `DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/tienda
SECRET_KEY=cambia-esto-por-un-secreto-largo-y-aleatorio`,
        },
        {
          name: 'app/core/config.py',
          lang: 'python',
          code: `from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")

    database_url: str
    secret_key: str
    debug: bool = False


settings = Settings()   # lee y valida las variables de entorno al arrancar`,
        },
        {
          name: 'app/db/session.py',
          lang: 'python',
          code: `from collections.abc import Generator
from typing import Annotated
from fastapi import Depends
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker
from app.core.config import settings

engine = create_engine(settings.database_url, echo=settings.debug, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


def get_db() -> Generator[Session, None, None]:
    with SessionLocal() as session:
        yield session


SessionDep = Annotated[Session, Depends(get_db)]`,
        },
      ],
    },
    {
      title: '2. Modelos (tablas) con relaciones',
      files: [
        {
          name: 'app/models/product.py',
          lang: 'python',
          code: `from datetime import datetime
from decimal import Decimal
from sqlalchemy import ForeignKey, Numeric, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.session import Base


class Category(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), unique=True)

    products: Mapped[list["Product"]] = relationship(back_populates="category")


class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(150), index=True)
    description: Mapped[str | None]                     # "| None" → columna NULL
    price: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    stock: Mapped[int] = mapped_column(default=0)
    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id"))
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())

    category: Mapped[Category] = relationship(back_populates="products")`,
        },
        {
          name: 'app/models/user.py',
          lang: 'python',
          code: `from enum import StrEnum
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column
from app.db.session import Base


class Role(StrEnum):
    USER = "user"
    ADMIN = "admin"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    full_name: Mapped[str]
    hashed_password: Mapped[str]
    role: Mapped[Role] = mapped_column(default=Role.USER)
    is_active: Mapped[bool] = mapped_column(default=True)`,
        },
      ],
    },
    {
      title: '3. Consultas con select()',
      lang: 'python',
      code: `from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload
from app.models.product import Category, Product


def examples(db: Session) -> None:
    # Por clave primaria
    product = db.get(Product, 1)

    # Filtros, orden y paginación
    stmt = (
        select(Product)
        .where(Product.stock > 0, Product.price < 100)
        .where(Product.name.ilike("%teclado%"))
        .order_by(Product.price.desc())
        .offset(0)
        .limit(20)
    )
    products = db.scalars(stmt).all()              # list[Product]

    # Uno o ninguno
    user = db.scalar(select(User).where(User.email == "ana@mail.com"))

    # Cargar la relación en la misma consulta (evita el problema N+1)
    with_category = db.scalars(select(Product).options(selectinload(Product.category))).all()

    # JOIN y agregación: productos por categoría
    rows = db.execute(
        select(Category.name, func.count(Product.id).label("total"))
        .join(Product, isouter=True)
        .group_by(Category.name)
    ).all()                                        # [('Audio', 3), ...]

    # Contar
    total = db.scalar(select(func.count()).select_from(Product))`,
    },
    {
      title: '4. CRUD completo con FastAPI',
      lang: 'python',
      code: `from fastapi import APIRouter, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session
from app.db.session import SessionDep
from app.models.product import Product
from app.schemas.product import Page, ProductCreate, ProductRead, ProductUpdate

router = APIRouter(prefix="/products", tags=["products"])


@router.get("/")
def list_products(db: SessionDep, page: int = 1, size: int = 20, search: str | None = None) -> Page[ProductRead]:
    stmt = select(Product)
    if search:
        stmt = stmt.where(Product.name.ilike(f"%{search}%"))

    total = db.scalar(select(func.count()).select_from(stmt.subquery())) or 0
    items = db.scalars(stmt.order_by(Product.id).offset((page - 1) * size).limit(size)).all()
    # ProductRead tiene from_attributes=True → valida directamente los objetos de SQLAlchemy
    return Page[ProductRead](items=items, total=total, page=page, size=size)


def _get_or_404(db: Session, product_id: int) -> Product:
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Producto no encontrado")
    return product


@router.get("/{product_id}")
def get_product(product_id: int, db: SessionDep) -> ProductRead:
    return _get_or_404(db, product_id)


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_product(data: ProductCreate, db: SessionDep) -> ProductRead:
    product = Product(**data.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)          # recarga id y created_at generados por la BD
    return product


@router.patch("/{product_id}")
def update_product(product_id: int, data: ProductUpdate, db: SessionDep) -> ProductRead:
    product = _get_or_404(db, product_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(product, field, value)
    db.commit()
    db.refresh(product)
    return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, db: SessionDep) -> None:
    product = _get_or_404(db, product_id)
    db.delete(product)
    db.commit()`,
    },
  ],
} satisfies Topic;
