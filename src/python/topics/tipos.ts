import type { Topic } from '../../types';

export default {
  id: 'type-hints',
  icon: '🏷️',
  title: 'Type hints, clases y async',
  description:
    'FastAPI se basa en las anotaciones de tipo (type hints) de Python: con ellas valida los datos, convierte tipos y genera la documentación. También necesitas clases, dataclasses, enums y la base de async/await.',
  tip: 'Python no comprueba los tipos al ejecutar (salvo que uses Pydantic, como hace FastAPI). Usa un editor con Pylance o mypy para que te avise de errores mientras escribes.',

  snippets: [
    {
      title: 'Type hints: anotaciones de tipo',
      lang: 'python',
      code: `from typing import Literal

name: str = "Ana"
age: int = 30
price: float = 19.99
tags: list[str] = ["python", "api"]
stock_by_id: dict[int, int] = {1: 25, 2: 40}
point: tuple[float, float] = (40.4, -3.7)

# Puede ser None → "X | None" (Python 3.10+)
city: str | None = None

# Solo ciertos valores
Status = Literal["pending", "paid", "shipped"]
status: Status = "paid"

# Funciones
def apply_discount(price: float, percent: int = 10) -> float:
    return round(price * (1 - percent / 100), 2)

def find_user(user_id: int) -> dict[str, str] | None:
    return None`,
    },
    {
      title: 'Clases y dataclasses',
      lang: 'python',
      code: `from dataclasses import dataclass, field
from datetime import datetime

# Clase "clásica"
class Product:
    def __init__(self, name: str, price: float, stock: int = 0) -> None:
        self.name = name          # self = la propia instancia (como "this")
        self.price = price
        self.stock = stock

    def is_available(self) -> bool:
        return self.stock > 0

    def __repr__(self) -> str:    # cómo se muestra al imprimirlo
        return f"Product({self.name!r}, {self.price})"

keyboard = Product("Teclado", 89.9, stock=25)
print(keyboard.is_available())

# dataclass: genera __init__, __repr__ y __eq__ automáticamente
@dataclass
class Order:
    customer: str
    total: float
    items: list[str] = field(default_factory=list)    # lista vacía por defecto
    created_at: datetime = field(default_factory=datetime.now)

order = Order("Ana", 129.4, ["teclado", "ratón"])
print(order)    # Order(customer='Ana', total=129.4, items=[...], created_at=...)

# Herencia
class DigitalProduct(Product):
    def is_available(self) -> bool:
        return True               # siempre disponible`,
    },
    {
      title: 'Enums',
      lang: 'python',
      code: `from enum import StrEnum

class OrderStatus(StrEnum):
    PENDING = "pending"
    PAID = "paid"
    SHIPPED = "shipped"
    CANCELLED = "cancelled"

status = OrderStatus.PAID
print(status == "paid")             # True (StrEnum se compara con str)
print([s.value for s in OrderStatus])

# En FastAPI, un parámetro de tipo OrderStatus solo acepta esos valores
# y aparece como desplegable en la documentación /docs`,
    },
    {
      title: 'async / await: código asíncrono',
      description:
        'Mientras una petición espera a la base de datos o a otra API, el servidor puede atender otras. Por eso FastAPI admite funciones async.',
      lang: 'python',
      code: `import asyncio
import time

async def fetch_user(user_id: int) -> dict[str, int | str]:
    await asyncio.sleep(1)               # simula una espera de red (no bloquea)
    return {"id": user_id, "name": f"Usuario {user_id}"}

async def main() -> None:
    start = time.perf_counter()

    # Secuencial: 3 segundos
    # u1 = await fetch_user(1); u2 = await fetch_user(2); u3 = await fetch_user(3)

    # En paralelo: ~1 segundo
    users = await asyncio.gather(fetch_user(1), fetch_user(2), fetch_user(3))

    print(users, f"{time.perf_counter() - start:.1f}s")

asyncio.run(main())

# ⚠️ Dentro de una función async no uses librerías bloqueantes (requests, time.sleep...):
#    usa sus versiones async (httpx.AsyncClient, asyncio.sleep, drivers async...).`,
    },
  ],
} satisfies Topic;
