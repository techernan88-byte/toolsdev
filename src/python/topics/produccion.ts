import type { Topic } from '../../types';

export default {
  id: 'produccion',
  icon: '🚢',
  title: 'Configuración y producción',
  description:
    'Llevar la API a producción: configuración validada con pydantic-settings, logs, Docker con uv, docker-compose con PostgreSQL, varios workers y la lista de comprobación final.',
  tip: 'En producción usa "fastapi run" (sin recarga) o uvicorn con varios workers, migraciones con "alembic upgrade head" al desplegar y nunca DEBUG=true.',

  snippets: [
    {
      title: 'Configuración tipada con pydantic-settings',
      lang: 'python',
      code: `from functools import lru_cache
from typing import Literal
from pydantic import Field, PostgresDsn
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    environment: Literal["development", "test", "production"] = "development"
    database_url: PostgresDsn                         # valida que sea una URL de Postgres
    secret_key: str = Field(min_length=32)
    access_token_minutes: int = 60
    cors_origins: list[str] = ["http://localhost:5173"]
    log_level: Literal["DEBUG", "INFO", "WARNING", "ERROR"] = "INFO"

    @property
    def is_production(self) -> bool:
        return self.environment == "production"


@lru_cache                     # se lee una sola vez
def get_settings() -> Settings:
    return Settings()          # si falta una variable → error claro al ARRANCAR


settings = get_settings()`,
    },
    {
      title: 'Docker y docker-compose',
      files: [
        {
          name: 'Dockerfile',
          lang: 'dockerfile',
          code: `FROM python:3.13-slim

# uv: instalador de dependencias muy rápido
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app
ENV UV_COMPILE_BYTECODE=1 UV_LINK_MODE=copy

# 1. Dependencias (capa cacheada mientras no cambien pyproject/uv.lock)
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev --no-install-project

# 2. Código
COPY . .
RUN uv sync --frozen --no-dev

ENV PATH="/app/.venv/bin:$PATH"
EXPOSE 8000

# Migraciones + servidor con 4 workers
CMD ["sh", "-c", "alembic upgrade head && fastapi run app/main.py --port 8000 --workers 4"]`,
        },
        {
          name: 'docker-compose.yml',
          lang: 'yaml',
          code: `services:
  db:
    image: postgres:17
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: tienda
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      retries: 5

  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      ENVIRONMENT: production
      DATABASE_URL: postgresql+psycopg://postgres:postgres@db:5432/tienda
      SECRET_KEY: \${SECRET_KEY}
    depends_on:
      db:
        condition: service_healthy

volumes:
  pgdata:`,
        },
        {
          name: 'terminal',
          lang: 'bash',
          code: `docker compose up -d db           # solo PostgreSQL (desarrollo)
docker compose up --build         # API + base de datos
docker compose exec api alembic current
docker compose logs -f api`,
        },
      ],
    },
    {
      title: 'pyproject.toml de un proyecto completo',
      lang: 'toml',
      code: `[project]
name = "tienda-api"
version = "1.0.0"
requires-python = ">=3.12"
dependencies = [
    "fastapi[standard]>=0.115",
    "sqlalchemy>=2.0",
    "psycopg[binary]>=3.2",
    "alembic>=1.14",
    "pydantic-settings>=2.6",
    "pyjwt>=2.10",
    "pwdlib[argon2]>=0.2",
]

[dependency-groups]
dev = ["pytest>=8", "pytest-cov", "httpx", "ruff", "mypy"]

[tool.ruff]
line-length = 110

[tool.ruff.lint]
select = ["E", "F", "I", "UP", "B"]     # errores, imports ordenados, sintaxis moderna, bugs

[tool.pytest.ini_options]
testpaths = ["tests"]`,
    },
    {
      title: 'Checklist antes de desplegar',
      lang: 'text',
      code: `✅ Configuración validada con pydantic-settings (falla al arrancar si falta algo)
✅ SECRET_KEY larga y aleatoria, fuera del código (variables de entorno / gestor de secretos)
✅ CORS solo con los orígenes reales del frontend
✅ Esquemas de salida (UserRead…) que nunca exponen contraseñas ni campos internos
✅ Manejador global de errores: 500 sin detalles internos, logs con el traceback
✅ "alembic upgrade head" en cada despliegue
✅ Índices en las columnas de búsqueda, filtros y claves foráneas
✅ Varios workers (--workers) o réplicas detrás de un balanceador
✅ Endpoint /health para el orquestador (Docker, Kubernetes, Render, Railway…)
✅ Rate limiting en login (slowapi o en el proxy: Nginx, Cloudflare)
✅ Tests en CI (pytest) + ruff + mypy
✅ HTTPS siempre (lo pone el proxy o la plataforma)`,
    },
  ],
} satisfies Topic;
