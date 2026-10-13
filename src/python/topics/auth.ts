import type { Topic } from '../../types';

export default {
  id: 'auth',
  icon: '🔐',
  title: 'Autenticación con JWT',
  description:
    'Registro y login con contraseñas hasheadas (Argon2 con pwdlib) y tokens JWT (PyJWT). FastAPI integra el flujo OAuth2 "password": el botón Authorize de /docs funciona con tu login.',
  tip: 'Nunca guardes contraseñas en texto plano y responde "credenciales incorrectas" tanto si falla el email como la contraseña.',

  snippets: [
    {
      title: 'Módulo de autenticación completo',
      files: [
        {
          name: 'terminal',
          lang: 'bash',
          code: 'uv add pyjwt "pwdlib[argon2]"',
        },
        {
          name: 'app/core/security.py',
          lang: 'python',
          code: `from datetime import UTC, datetime, timedelta
import jwt
from pwdlib import PasswordHash
from app.core.config import settings

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE = timedelta(minutes=60)

password_hash = PasswordHash.recommended()     # Argon2


def hash_password(password: str) -> str:
    return password_hash.hash(password)


def verify_password(password: str, hashed: str) -> bool:
    return password_hash.verify(password, hashed)


def create_access_token(user_id: int, role: str) -> str:
    payload = {
        "sub": str(user_id),                       # "sub" = id del usuario
        "role": role,
        "exp": datetime.now(UTC) + ACCESS_TOKEN_EXPIRE,
    }
    return jwt.encode(payload, settings.secret_key, algorithm=ALGORITHM)


def decode_access_token(token: str) -> dict:
    # Lanza jwt.InvalidTokenError si la firma no es válida o ha expirado
    return jwt.decode(token, settings.secret_key, algorithms=[ALGORITHM])`,
        },
        {
          name: 'app/schemas/auth.py',
          lang: 'python',
          code: `from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserCreate(BaseModel):
    email: EmailStr
    full_name: str = Field(min_length=2)
    password: str = Field(min_length=8)


class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    full_name: str
    role: str                    # ⚠️ sin hashed_password


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"`,
        },
        {
          name: 'app/api/deps.py',
          lang: 'python',
          code: `from typing import Annotated
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.core.security import decode_access_token
from app.db.session import SessionDep
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

credentials_error = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="No se pudo validar el token",
    headers={"WWW-Authenticate": "Bearer"},
)


def get_current_user(db: SessionDep, token: Annotated[str, Depends(oauth2_scheme)]) -> User:
    try:
        payload = decode_access_token(token)
    except jwt.InvalidTokenError:
        raise credentials_error
    user = db.get(User, int(payload["sub"]))
    if user is None or not user.is_active:
        raise credentials_error
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]


def require_admin(user: CurrentUser) -> User:
    if user.role != "admin":
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Solo administradores")
    return user


AdminUser = Annotated[User, Depends(require_admin)]`,
        },
        {
          name: 'app/api/routes/auth.py',
          lang: 'python',
          code: `from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
from app.api.deps import CurrentUser
from app.core.security import create_access_token, hash_password, verify_password
from app.db.session import SessionDep
from app.models.user import User
from app.schemas.auth import Token, UserCreate, UserRead

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(data: UserCreate, db: SessionDep) -> UserRead:
    if db.scalar(select(User).where(User.email == data.email)):
        raise HTTPException(status.HTTP_409_CONFLICT, "Ese correo ya está registrado")
    user = User(email=data.email, full_name=data.full_name, hashed_password=hash_password(data.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


# OAuth2 envía username + password como formulario (username = email)
@router.post("/login")
def login(form: Annotated[OAuth2PasswordRequestForm, Depends()], db: SessionDep) -> Token:
    user = db.scalar(select(User).where(User.email == form.username))
    if not user or not verify_password(form.password, user.hashed_password):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Credenciales incorrectas")
    return Token(access_token=create_access_token(user.id, user.role))


@router.get("/me")
def me(user: CurrentUser) -> UserRead:
    return user`,
        },
      ],
    },
    {
      title: 'Probarlo con curl',
      lang: 'bash',
      code: `# Registro (JSON)
curl -X POST http://localhost:8000/api/v1/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{"email":"ana@mail.com","full_name":"Ana","password":"Secreta123"}'

# Login (formulario, por el estándar OAuth2)
curl -X POST http://localhost:8000/api/v1/auth/login \\
  -d "username=ana@mail.com&password=Secreta123"
# {"access_token":"eyJhbGciOi...","token_type":"bearer"}

# Ruta protegida
curl http://localhost:8000/api/v1/auth/me -H "Authorization: Bearer eyJhbGciOi..."`,
    },
  ],
} satisfies Topic;
