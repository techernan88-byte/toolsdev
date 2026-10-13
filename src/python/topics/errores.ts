import type { Topic } from '../../types';

export default {
  id: 'errores',
  icon: '🚨',
  title: 'Errores y respuestas',
  description:
    'Para devolver un error se lanza HTTPException con el código y el mensaje. En proyectos grandes se crean excepciones propias del dominio (NotFound, Conflict…) y un manejador global las convierte en respuestas JSON coherentes.',
  tip: 'FastAPI ya devuelve 422 con el detalle por campo cuando falla la validación de Pydantic. No necesitas validar a mano lo que ya declaraste en los tipos.',

  snippets: [
    {
      title: 'HTTPException y códigos de estado',
      lang: 'python',
      code: `from fastapi import FastAPI, HTTPException, Response, status

app = FastAPI()
products = {1: {"name": "Teclado", "stock": 0}}


@app.get("/products/{product_id}")
def get_product(product_id: int):
    product = products.get(product_id)
    if product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado")
    return product


@app.post("/products/{product_id}/buy")
def buy(product_id: int):
    product = get_product(product_id)
    if product["stock"] == 0:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={"code": "OUT_OF_STOCK", "message": "Sin stock"},
            headers={"Retry-After": "3600"},
        )
    return {"ok": True}


@app.delete("/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(product_id: int) -> Response:
    products.pop(product_id, None)
    return Response(status_code=status.HTTP_204_NO_CONTENT)`,
    },
    {
      title: 'Respuesta de validación automática (422)',
      lang: 'json',
      code: `// POST /products  con  {"name": "X", "price": -5}
{
  "detail": [
    {
      "type": "string_too_short",
      "loc": ["body", "name"],
      "msg": "String should have at least 2 characters",
      "input": "X",
      "ctx": { "min_length": 2 }
    },
    {
      "type": "greater_than",
      "loc": ["body", "price"],
      "msg": "Input should be greater than 0",
      "input": -5,
      "ctx": { "gt": 0 }
    }
  ]
}`,
    },
    {
      title: 'Excepciones del dominio y manejador global',
      files: [
        {
          name: 'app/core/exceptions.py',
          lang: 'python',
          code: `class AppError(Exception):
    status_code = 400
    code = "APP_ERROR"

    def __init__(self, message: str) -> None:
        self.message = message
        super().__init__(message)


class NotFoundError(AppError):
    status_code = 404
    code = "NOT_FOUND"

    def __init__(self, resource: str = "Recurso") -> None:
        super().__init__(f"{resource} no encontrado")


class ConflictError(AppError):
    status_code = 409
    code = "CONFLICT"


class PermissionDeniedError(AppError):
    status_code = 403
    code = "FORBIDDEN"`,
        },
        {
          name: 'app/main.py',
          lang: 'python',
          code: `import logging
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError
from app.core.exceptions import AppError

logger = logging.getLogger(__name__)
app = FastAPI()


@app.exception_handler(AppError)
async def app_error_handler(_request: Request, exc: AppError) -> JSONResponse:
    return JSONResponse(status_code=exc.status_code, content={"code": exc.code, "message": exc.message})


@app.exception_handler(IntegrityError)          # violaciones de UNIQUE / FOREIGN KEY
async def integrity_error_handler(_request: Request, _exc: IntegrityError) -> JSONResponse:
    return JSONResponse(status_code=409, content={"code": "CONFLICT", "message": "El registro ya existe o viola una relación"})


@app.exception_handler(Exception)               # cualquier otro error → 500 sin filtrar detalles
async def unhandled_error_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.exception("Error no controlado en %s %s", request.method, request.url.path)
    return JSONResponse(status_code=500, content={"code": "INTERNAL_ERROR", "message": "Error interno del servidor"})`,
        },
        {
          name: 'uso en un servicio',
          lang: 'python',
          code: `from app.core.exceptions import ConflictError, NotFoundError


def get_product(db, product_id: int):
    product = db.get(Product, product_id)
    if product is None:
        raise NotFoundError("Producto")       # → 404 {"code": "NOT_FOUND", ...}
    return product


def register(db, email: str):
    if db.scalar(select(User).where(User.email == email)):
        raise ConflictError("Ese correo ya está registrado")   # → 409`,
        },
      ],
    },
  ],
} satisfies Topic;
