import type { Topic } from '../../types';

export default {
  id: 'async-middleware',
  icon: '⚙️',
  title: 'Async, middleware y tareas',
  description:
    'Endpoints asíncronos con SQLAlchemy async, el ciclo de vida de la app (lifespan), middleware (CORS, tiempos de respuesta), tareas en segundo plano y llamadas a otras APIs con httpx.',
  tip: 'Usa "async def" solo si TODO lo que haces dentro es asíncrono (await). Si usas una librería síncrona (SQLAlchemy normal, requests), escribe "def" y FastAPI lo ejecutará en un hilo aparte.',

  snippets: [
    {
      title: 'SQLAlchemy asíncrono',
      files: [
        {
          name: 'terminal',
          lang: 'bash',
          code: 'uv add "sqlalchemy[asyncio]" asyncpg',
        },
        {
          name: 'app/db/session.py',
          lang: 'python',
          code: `from collections.abc import AsyncGenerator
from typing import Annotated
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

# Driver async: postgresql+asyncpg://...
engine = create_async_engine("postgresql+asyncpg://postgres:postgres@localhost:5432/tienda", pool_size=10)
SessionLocal = async_sessionmaker(engine, expire_on_commit=False)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with SessionLocal() as session:
        yield session


AsyncSessionDep = Annotated[AsyncSession, Depends(get_db)]`,
        },
        {
          name: 'app/api/routes/products.py',
          lang: 'python',
          code: `from sqlalchemy import select
from app.db.session import AsyncSessionDep
from app.models.product import Product


@router.get("/")
async def list_products(db: AsyncSessionDep) -> list[ProductRead]:
    result = await db.scalars(select(Product).order_by(Product.id).limit(50))
    return result.all()


@router.post("/", status_code=201)
async def create_product(data: ProductCreate, db: AsyncSessionDep) -> ProductRead:
    product = Product(**data.model_dump())
    db.add(product)
    await db.commit()
    await db.refresh(product)
    return product`,
        },
      ],
    },
    {
      title: 'Lifespan, CORS y middleware propio',
      lang: 'python',
      code: `import logging
import time
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.db.session import engine

logger = logging.getLogger("api")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 Arrancando: abrir conexiones, cargar modelos de IA, calentar cachés…")
    yield                                   # aquí la app atiende peticiones
    logger.info("🛑 Apagando: cerrar conexiones")
    await engine.dispose()


app = FastAPI(lifespan=lifespan)

# CORS: permitir que el frontend (otro origen) llame a la API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Middleware propio: medir cuánto tarda cada petición
@app.middleware("http")
async def timing(request: Request, call_next):
    start = time.perf_counter()
    response = await call_next(request)
    elapsed_ms = (time.perf_counter() - start) * 1000
    response.headers["X-Response-Time"] = f"{elapsed_ms:.1f}ms"
    logger.info("%s %s → %s (%.1f ms)", request.method, request.url.path, response.status_code, elapsed_ms)
    return response`,
    },
    {
      title: 'Tareas en segundo plano y llamadas a otras APIs (httpx)',
      lang: 'python',
      code: `import httpx
from fastapi import APIRouter, BackgroundTasks

router = APIRouter()


def send_welcome_email(email: str) -> None:
    # Se ejecuta DESPUÉS de enviar la respuesta: el usuario no espera
    print(f"📧 Enviando email de bienvenida a {email}")


@router.post("/users", status_code=201)
def create_user(data: UserCreate, background: BackgroundTasks) -> UserRead:
    user = save_user(data)
    background.add_task(send_welcome_email, user.email)
    return user


# Llamar a otra API sin bloquear el servidor
@router.get("/weather/{city}")
async def weather(city: str) -> dict:
    async with httpx.AsyncClient(timeout=5) as client:
        response = await client.get("https://wttr.in/" + city, params={"format": "j1"})
        response.raise_for_status()
        data = response.json()
    return {"city": city, "temp_c": data["current_condition"][0]["temp_C"]}

# 💡 Para trabajos largos o que deben reintentarse (informes, emails masivos):
#    usa una cola de tareas como Celery, Dramatiq o ARQ con Redis.`,
    },
  ],
} satisfies Topic;
