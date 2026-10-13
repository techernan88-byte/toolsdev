import type { Topic } from '../../types';

export default {
  id: 'testing',
  icon: '🧪',
  title: 'Tests con pytest',
  description:
    'pytest es el estándar para tests en Python. Con el TestClient de FastAPI llamas a la API sin levantar el servidor, y con dependency_overrides sustituyes la base de datos real por una de pruebas.',
  tip: 'Las fixtures de pytest preparan lo que necesita cada test (cliente, base de datos limpia, usuario autenticado) y se inyectan por nombre, igual que las dependencias de FastAPI.',

  snippets: [
    {
      title: 'Configuración y fixtures',
      files: [
        {
          name: 'terminal',
          lang: 'bash',
          code: `uv add --dev pytest pytest-cov httpx

uv run pytest                    # ejecutar todos los tests
uv run pytest -k products -v     # solo los que contienen "products"
uv run pytest --cov=app          # cobertura`,
        },
        {
          name: 'tests/conftest.py',
          lang: 'python',
          code: `from collections.abc import Generator
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from app.db.session import Base, get_db
from app.main import app

# Base de datos SOLO para tests (nunca la de desarrollo)
engine = create_engine("postgresql+psycopg://postgres:postgres@localhost:5432/tienda_test")
TestingSession = sessionmaker(bind=engine, expire_on_commit=False)


@pytest.fixture
def db() -> Generator[Session, None, None]:
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)        # tablas limpias en cada test
    with TestingSession() as session:
        yield session


@pytest.fixture
def client(db: Session) -> Generator[TestClient, None, None]:
    # Sustituye la dependencia real por la sesión de pruebas
    app.dependency_overrides[get_db] = lambda: db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def auth_headers(client: TestClient) -> dict[str, str]:
    client.post("/api/v1/auth/register", json={"email": "ana@test.com", "full_name": "Ana", "password": "Password123"})
    response = client.post("/api/v1/auth/login", data={"username": "ana@test.com", "password": "Password123"})
    return {"Authorization": f"Bearer {response.json()['access_token']}"}`,
        },
      ],
    },
    {
      title: 'Tests de la API',
      lang: 'python',
      code: `from fastapi.testclient import TestClient


def test_health(client: TestClient) -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_register_does_not_return_password(client: TestClient) -> None:
    response = client.post(
        "/api/v1/auth/register",
        json={"email": "luis@test.com", "full_name": "Luis", "password": "Password123"},
    )
    assert response.status_code == 201
    body = response.json()
    assert body["email"] == "luis@test.com"
    assert "hashed_password" not in body


def test_register_duplicate_email_returns_409(client: TestClient) -> None:
    payload = {"email": "dup@test.com", "full_name": "Dup", "password": "Password123"}
    client.post("/api/v1/auth/register", json=payload)
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 409


def test_validation_error_returns_422(client: TestClient) -> None:
    response = client.post("/api/v1/auth/register", json={"email": "no-es-un-email"})
    assert response.status_code == 422
    fields = {error["loc"][-1] for error in response.json()["detail"]}
    assert {"email", "full_name", "password"} <= fields


def test_me_requires_token(client: TestClient) -> None:
    assert client.get("/api/v1/auth/me").status_code == 401


def test_me_with_token(client: TestClient, auth_headers: dict[str, str]) -> None:
    response = client.get("/api/v1/auth/me", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["email"] == "ana@test.com"`,
    },
    {
      title: 'Tests unitarios y parametrizados',
      lang: 'python',
      code: `import pytest
from app.core.security import hash_password, verify_password
from app.schemas.auth import UserCreate
from pydantic import ValidationError


def test_password_hash_roundtrip() -> None:
    hashed = hash_password("Secreta123")
    assert hashed != "Secreta123"
    assert verify_password("Secreta123", hashed)
    assert not verify_password("otra", hashed)


# Un test, varios casos
@pytest.mark.parametrize(
    ("email", "valid"),
    [
        ("ana@mail.com", True),
        ("sin-arroba.com", False),
        ("", False),
    ],
)
def test_user_email_validation(email: str, valid: bool) -> None:
    data = {"email": email, "full_name": "Ana", "password": "Password123"}
    if valid:
        UserCreate(**data)
    else:
        with pytest.raises(ValidationError):
            UserCreate(**data)`,
    },
  ],
} satisfies Topic;
