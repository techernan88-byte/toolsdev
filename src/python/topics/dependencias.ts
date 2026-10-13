import type { Topic } from '../../types';

export default {
  id: 'dependencias',
  icon: '🧩',
  title: 'Inyección de dependencias',
  description:
    'Depends() le dice a FastAPI: "antes de ejecutar esta ruta, ejecuta esta función y pásame su resultado". Se usa para la sesión de base de datos, el usuario autenticado, la paginación, permisos… Y en los tests se pueden sustituir por versiones falsas.',
  tip: 'Crea alias con Annotated (SessionDep, CurrentUser) para no repetir Depends(...) en cada endpoint: el código queda mucho más limpio.',

  snippets: [
    {
      title: 'Dependencia simple: parámetros de paginación reutilizables',
      lang: 'python',
      code: `from typing import Annotated
from fastapi import Depends, FastAPI, Query
from pydantic import BaseModel

app = FastAPI()


class Pagination(BaseModel):
    page: int
    size: int

    @property
    def offset(self) -> int:
        return (self.page - 1) * self.size


def pagination_params(
    page: Annotated[int, Query(ge=1)] = 1,
    size: Annotated[int, Query(ge=1, le=100)] = 20,
) -> Pagination:
    return Pagination(page=page, size=size)


PaginationDep = Annotated[Pagination, Depends(pagination_params)]


@app.get("/products")
def list_products(pagination: PaginationDep):
    return {"offset": pagination.offset, "limit": pagination.size}


@app.get("/orders")
def list_orders(pagination: PaginationDep):     # reutilizada
    return {"page": pagination.page}`,
    },
    {
      title: 'Dependencias con yield: abrir y cerrar recursos',
      description:
        'El código antes del yield se ejecuta antes de la ruta; el de después, al terminar (aunque haya error).',
      lang: 'python',
      code: `from collections.abc import Generator
from typing import Annotated
from fastapi import Depends
from sqlalchemy.orm import Session
from app.db.session import SessionLocal


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()          # 1. abrir la sesión
    try:
        yield db                 # 2. la ruta la usa
    finally:
        db.close()               # 3. cerrarla SIEMPRE


SessionDep = Annotated[Session, Depends(get_db)]


@router.get("/products/{product_id}")
def get_product(product_id: int, db: SessionDep):
    return db.get(Product, product_id)`,
    },
    {
      title: 'Dependencias que dependen de otras: usuario actual y roles',
      lang: 'python',
      code: `from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


def get_current_user(db: SessionDep, token: Annotated[str, Depends(oauth2_scheme)]) -> User:
    user = decode_token_and_get_user(db, token)          # usa otra dependencia (db)
    if user is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Token inválido", headers={"WWW-Authenticate": "Bearer"})
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]


# "Fábrica" de dependencias: recibe parámetros y devuelve la dependencia
def require_role(*roles: str):
    def checker(user: CurrentUser) -> User:
        if user.role not in roles:
            raise HTTPException(status.HTTP_403_FORBIDDEN, "No tienes permisos")
        return user
    return checker


@router.get("/me")
def me(user: CurrentUser):
    return user


@router.delete("/products/{product_id}", dependencies=[Depends(require_role("admin"))])
def delete_product(product_id: int, db: SessionDep): ...


# Para TODO un router
admin_router = APIRouter(prefix="/admin", dependencies=[Depends(require_role("admin"))])`,
    },
  ],
} satisfies Topic;
