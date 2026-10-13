import type { Topic } from '../../types';

export default {
  id: 'rutas-parametros',
  icon: '🛣️',
  title: 'Rutas y parámetros',
  description:
    'FastAPI lee los datos de la petición según cómo declares los parámetros de la función: si están en la ruta son "path params", si son tipos simples son "query params" y si son modelos de Pydantic vienen en el body (JSON).',
  tip: 'Usa Annotated[tipo, Query(...)] o Path(...) para añadir validaciones (mínimo, máximo, longitud…). FastAPI responde 422 automáticamente si los datos no son válidos.',

  snippets: [
    {
      title: 'Path, query y body',
      lang: 'python',
      code: `from typing import Annotated
from fastapi import FastAPI, Path, Query
from pydantic import BaseModel

app = FastAPI()


# PATH: /products/42  → product_id = 42 (int, validado)
@app.get("/products/{product_id}")
def get_product(product_id: Annotated[int, Path(gt=0)]):
    return {"id": product_id}


# QUERY: /products?search=teclado&page=2&limit=20&in_stock=true
@app.get("/products")
def list_products(
    search: str | None = None,                                   # opcional
    page: Annotated[int, Query(ge=1)] = 1,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
    in_stock: bool = False,                                      # "true", "1", "yes" → True
    tags: Annotated[list[str], Query()] = [],                    # ?tags=a&tags=b
):
    return {"search": search, "page": page, "limit": limit, "in_stock": in_stock, "tags": tags}


# BODY: JSON validado con un modelo de Pydantic
class ProductCreate(BaseModel):
    name: str
    price: float
    stock: int = 0


@app.post("/products", status_code=201)
def create_product(product: ProductCreate):
    return {"created": product}


# Los tres a la vez
@app.put("/categories/{category_id}/products/{product_id}")
def update_product(category_id: int, product_id: int, product: ProductCreate, notify: bool = False):
    return {"category_id": category_id, "product_id": product_id, "data": product, "notify": notify}`,
    },
    {
      title: 'APIRouter: separar las rutas por archivos',
      files: [
        {
          name: 'app/api/routes/products.py',
          lang: 'python',
          code: `from fastapi import APIRouter

router = APIRouter(prefix="/products", tags=["products"])   # tags agrupa en /docs


@router.get("/")
def list_products():
    return []


@router.get("/{product_id}")
def get_product(product_id: int):
    return {"id": product_id}`,
        },
        {
          name: 'app/main.py',
          lang: 'python',
          code: `from fastapi import FastAPI
from app.api.routes import auth, products, users

app = FastAPI(title="Tienda API")

app.include_router(auth.router, prefix="/api/v1")
app.include_router(users.router, prefix="/api/v1")
app.include_router(products.router, prefix="/api/v1")
# → /api/v1/products, /api/v1/products/{product_id}, ...`,
        },
      ],
    },
    {
      title: 'Headers, cookies, formularios y archivos',
      lang: 'python',
      code: `from typing import Annotated
from fastapi import Cookie, FastAPI, File, Form, Header, UploadFile

app = FastAPI()


@app.get("/whoami")
def whoami(
    user_agent: Annotated[str | None, Header()] = None,     # cabecera User-Agent
    session_id: Annotated[str | None, Cookie()] = None,
):
    return {"user_agent": user_agent, "session_id": session_id}


# Formulario HTML clásico (application/x-www-form-urlencoded)
@app.post("/contact")
def contact(name: Annotated[str, Form()], message: Annotated[str, Form()]):
    return {"name": name, "message": message}


# Subida de archivos (multipart/form-data)
@app.post("/avatar")
async def upload_avatar(file: UploadFile):
    content = await file.read()
    return {"filename": file.filename, "type": file.content_type, "size": len(content)}`,
    },
  ],
} satisfies Topic;
