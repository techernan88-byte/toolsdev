import type { Topic } from '../../types';

export default {
  id: 'alembic',
  icon: '🗂️',
  title: 'Migraciones con Alembic',
  description:
    'Alembic guarda el historial de cambios de la base de datos en archivos de migración (como git, pero para las tablas). Compara tus modelos de SQLAlchemy con la base de datos y genera el SQL necesario.',
  tip: 'Revisa SIEMPRE la migración generada antes de aplicarla: autogenerate no detecta todo (renombrados de columnas, por ejemplo, los interpreta como borrar + crear).',

  snippets: [
    {
      title: 'Configuración inicial',
      files: [
        {
          name: 'terminal',
          lang: 'bash',
          code: `uv add alembic
uv run alembic init alembic        # crea alembic.ini y la carpeta alembic/`,
        },
        {
          name: 'alembic/env.py (cambios)',
          lang: 'python',
          code: `from app.core.config import settings
from app.db.session import Base
import app.models  # noqa: F401 — importa TODOS los modelos para que Alembic los vea

# URL desde la configuración de la app (no la escribas en alembic.ini)
config.set_main_option("sqlalchemy.url", settings.database_url)

# Metadatos con los que se comparan las tablas
target_metadata = Base.metadata`,
        },
        {
          name: 'app/models/__init__.py',
          lang: 'python',
          code: `from app.models.product import Category, Product
from app.models.user import User

__all__ = ["Category", "Product", "User"]`,
        },
      ],
    },
    {
      title: 'Comandos del día a día',
      lang: 'bash',
      code: `# Generar una migración comparando los modelos con la BD
uv run alembic revision --autogenerate -m "create products and categories"

# Aplicar todas las migraciones pendientes
uv run alembic upgrade head

# Deshacer la última migración
uv run alembic downgrade -1

# Ver el estado
uv run alembic current        # en qué migración está la BD
uv run alembic history        # todas las migraciones

# Ver el SQL sin ejecutarlo (útil para revisar antes de producción)
uv run alembic upgrade head --sql`,
    },
    {
      title: 'Una migración generada (y revisada)',
      lang: 'python',
      code: `"""create products and categories

Revision ID: 3f2a1c9d8b7e
Revises:
Create Date: 2026-10-12 10:00:00
"""
import sqlalchemy as sa
from alembic import op

revision = "3f2a1c9d8b7e"
down_revision = None


def upgrade() -> None:
    op.create_table(
        "categories",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(100), nullable=False, unique=True),
    )
    op.create_table(
        "products",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(150), nullable=False),
        sa.Column("price", sa.Numeric(10, 2), nullable=False),
        sa.Column("stock", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("category_id", sa.Integer(), sa.ForeignKey("categories.id"), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_products_name", "products", ["name"])
    # ✍️ Añadido a mano: autogenerate no crea CHECK constraints
    op.create_check_constraint("ck_products_price_positive", "products", "price > 0")


def downgrade() -> None:
    op.drop_table("products")
    op.drop_table("categories")`,
    },
  ],
} satisfies Topic;
