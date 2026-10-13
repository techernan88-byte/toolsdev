import type { Topic } from '../../types';

export default {
  id: 'pydantic',
  icon: '🛡️',
  title: 'Pydantic: modelos y validación',
  description:
    'Pydantic define la FORMA de los datos con clases y type hints, y los valida al recibirlos. FastAPI lo usa para el body, para las respuestas (response_model) y para la documentación. Es el equivalente a Zod en TypeScript.',
  tip: 'Separa los esquemas por uso: ProductCreate (entrada), ProductUpdate (todo opcional) y ProductRead (salida). Así nunca devuelves campos internos como la contraseña.',

  snippets: [
    {
      title: 'Modelos con validaciones',
      lang: 'python',
      code: `from datetime import date
from decimal import Decimal
from pydantic import BaseModel, EmailStr, Field, HttpUrl


class Address(BaseModel):
    street: str
    city: str
    zip_code: str = Field(pattern=r"^\\d{5}$")


class CustomerCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr                                   # valida el formato del email
    age: int | None = Field(default=None, ge=18, le=120)
    website: HttpUrl | None = None
    birth_date: date | None = None
    address: Address                                  # modelo anidado
    tags: list[str] = Field(default_factory=list, max_length=10)


class ProductCreate(BaseModel):
    name: str = Field(min_length=2, examples=["Teclado mecánico"])
    price: Decimal = Field(gt=0, decimal_places=2)
    stock: int = Field(default=0, ge=0)


# Uso directo (fuera de FastAPI)
customer = CustomerCreate.model_validate({
    "name": "Ana", "email": "ana@mail.com",
    "address": {"street": "Gran Vía 1", "city": "Madrid", "zip_code": "28013"},
})
print(customer.model_dump())          # → dict
print(customer.model_dump_json())     # → JSON (str)`,
    },
    {
      title: 'Validadores personalizados',
      lang: 'python',
      code: `from pydantic import BaseModel, field_validator, model_validator


class Register(BaseModel):
    username: str
    password: str
    confirm_password: str

    # Valida (y transforma) un solo campo
    @field_validator("username")
    @classmethod
    def normalize_username(cls, value: str) -> str:
        value = value.strip().lower()
        if not value.isalnum():
            raise ValueError("Solo letras y números")
        return value

    @field_validator("password")
    @classmethod
    def strong_password(cls, value: str) -> str:
        if len(value) < 8 or value.isdigit() or value.isalpha():
            raise ValueError("Mínimo 8 caracteres, con letras y números")
        return value

    # Valida varios campos juntos (después de validar cada uno)
    @model_validator(mode="after")
    def passwords_match(self) -> "Register":
        if self.password != self.confirm_password:
            raise ValueError("Las contraseñas no coinciden")
        return self`,
    },
    {
      title: 'Esquemas de entrada / salida y response_model',
      files: [
        {
          name: 'app/schemas/product.py',
          lang: 'python',
          code: `from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, ConfigDict, Field


class ProductBase(BaseModel):
    name: str = Field(min_length=2, max_length=150)
    description: str | None = None
    price: Decimal = Field(gt=0)
    stock: int = Field(default=0, ge=0)
    category_id: int


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):             # PATCH: todos opcionales
    name: str | None = Field(default=None, min_length=2)
    description: str | None = None
    price: Decimal | None = Field(default=None, gt=0)
    stock: int | None = Field(default=None, ge=0)


class ProductRead(ProductBase):
    # from_attributes: permite crear el esquema desde un modelo de SQLAlchemy
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime


class Page[T](BaseModel):                   # respuesta paginada genérica (Python 3.12+)
    items: list[T]
    total: int
    page: int
    size: int`,
        },
        {
          name: 'app/api/routes/products.py',
          lang: 'python',
          code: `from fastapi import APIRouter
from app.schemas.product import Page, ProductCreate, ProductRead, ProductUpdate

router = APIRouter(prefix="/products", tags=["products"])


# El tipo de retorno (-> ProductRead) es el response_model:
# filtra los campos, valida la salida y documenta la respuesta en /docs
@router.post("/", status_code=201)
def create_product(data: ProductCreate) -> ProductRead: ...


@router.get("/")
def list_products(page: int = 1, size: int = 20) -> Page[ProductRead]: ...


@router.patch("/{product_id}")
def update_product(product_id: int, data: ProductUpdate) -> ProductRead:
    changes = data.model_dump(exclude_unset=True)   # SOLO los campos que envió el cliente
    ...`,
        },
      ],
    },
  ],
} satisfies Topic;
