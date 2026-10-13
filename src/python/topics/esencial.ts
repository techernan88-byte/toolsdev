import type { Topic } from '../../types';

export default {
  id: 'python-esencial',
  icon: '🐍',
  title: 'Python esencial',
  description:
    'Lo imprescindible de Python para empezar con FastAPI: variables, colecciones (listas, diccionarios, tuplas, sets), condicionales, bucles, funciones, comprensiones de listas y manejo de errores.',
  tip: 'En Python la indentación (4 espacios) define los bloques: no hay llaves { }. Y los nombres se escriben en snake_case: total_price, get_user.',

  snippets: [
    {
      title: 'Variables, tipos y f-strings',
      lang: 'python',
      code: `name = "Ada"            # str
age = 36                 # int
height = 1.65            # float
is_admin = True          # bool (con mayúscula)
nickname = None          # "nada" (como null)

# f-strings: insertar variables en un texto
print(f"{name} tiene {age} años y mide {height:.2f} m")
print(f"Precio: {1234.5:,.2f} €")        # 1,234.50 €

# Conversión de tipos
edad_texto = str(age)          # "36"
numero = int("42")             # 42
precio = float("19.99")        # 19.99

# Operaciones con texto
email = "  Ana@Mail.COM "
print(email.strip().lower())            # "ana@mail.com"
print("python" in "Aprendo python")     # True
print("a,b,c".split(","))               # ['a', 'b', 'c']`,
    },
    {
      title: 'Listas, diccionarios, tuplas y sets',
      lang: 'python',
      code: `# LISTA: ordenada y modificable
products = ["teclado", "ratón", "monitor"]
products.append("webcam")
products.remove("ratón")
print(products[0], products[-1], len(products))   # teclado webcam 3
print(products[1:3])                               # slicing: ['monitor', 'webcam']

# DICCIONARIO: clave → valor (como un objeto JSON)
user = {"name": "Ana", "email": "ana@mail.com", "age": 30}
user["city"] = "Madrid"
print(user["name"])                    # Ana
print(user.get("phone", "sin teléfono"))   # valor por defecto si no existe

for key, value in user.items():
    print(key, "→", value)

# TUPLA: como una lista pero inmutable
point = (10, 20)
x, y = point                           # desempaquetado

# SET: sin duplicados
tags = {"python", "api", "python"}
print(tags)                            # {'python', 'api'}`,
    },
    {
      title: 'Condicionales y bucles',
      lang: 'python',
      code: `stock = 3

if stock == 0:
    print("Agotado")
elif stock < 5:
    print("Pocas unidades")
else:
    print("Disponible")

# Operador ternario
label = "Agotado" if stock == 0 else "Disponible"

# for sobre una lista
for product in ["teclado", "ratón"]:
    print(product)

# Con índice
for index, product in enumerate(["teclado", "ratón"], start=1):
    print(index, product)

# range
for n in range(1, 6):        # 1, 2, 3, 4, 5
    print(n)

# while
attempts = 0
while attempts < 3:
    attempts += 1

# match (como switch, Python 3.10+)
status = "paid"
match status:
    case "pending":
        print("⏳")
    case "paid" | "shipped":
        print("✅")
    case _:
        print("❓")`,
    },
    {
      title: 'Funciones',
      lang: 'python',
      code: `def greet(name: str, greeting: str = "Hola") -> str:
    """Devuelve un saludo. (Esto es un docstring: documenta la función)"""
    return f"{greeting}, {name}!"

print(greet("Ana"))                       # Hola, Ana!
print(greet("Luis", greeting="Buenas"))   # argumento con nombre

# Varios valores de retorno (en realidad devuelve una tupla)
def min_max(numbers: list[int]) -> tuple[int, int]:
    return min(numbers), max(numbers)

low, high = min_max([4, 1, 9])

# *args y **kwargs: número variable de argumentos
def log(*messages: str, **extra: str) -> None:
    print(" ".join(messages), extra)

log("Usuario", "creado", user_id="42", level="info")

# Lambda: función anónima de una línea
products = [{"name": "Monitor", "price": 329}, {"name": "Ratón", "price": 39}]
cheapest_first = sorted(products, key=lambda p: p["price"])`,
    },
    {
      title: 'Comprensiones de listas y diccionarios',
      lang: 'python',
      code: `prices = [89.9, 39.5, 329, 19.9]

# [expresión for elemento in colección if condición]
with_tax = [round(p * 1.21, 2) for p in prices]
cheap = [p for p in prices if p < 50]

# Diccionario
products = [{"id": 1, "name": "Teclado"}, {"id": 2, "name": "Ratón"}]
names_by_id = {p["id"]: p["name"] for p in products}     # {1: 'Teclado', 2: 'Ratón'}

# Funciones útiles con colecciones
total = sum(prices)
has_expensive = any(p > 300 for p in prices)
all_positive = all(p > 0 for p in prices)
pairs = list(zip(["a", "b"], [1, 2]))                    # [('a', 1), ('b', 2)]`,
    },
    {
      title: 'Errores (excepciones) y módulos',
      lang: 'python',
      code: `import json                          # módulo de la librería estándar
from datetime import date, timedelta  # importar solo lo que necesitas
from pathlib import Path

def parse_price(text: str) -> float:
    try:
        price = float(text)
    except ValueError:
        raise ValueError(f"'{text}' no es un precio válido")
    if price <= 0:
        raise ValueError("El precio debe ser mayor que 0")
    return price

try:
    parse_price("abc")
except ValueError as error:
    print(f"Error: {error}")
finally:
    print("Esto se ejecuta siempre")

# Excepción propia
class NotFoundError(Exception):
    pass

# Leer y escribir archivos (with cierra el archivo automáticamente)
data = {"fecha": str(date.today() + timedelta(days=7))}
Path("data.json").write_text(json.dumps(data, indent=2))

with open("data.json") as file:
    print(json.load(file))`,
    },
  ],
} satisfies Topic;
