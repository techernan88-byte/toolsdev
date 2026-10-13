import type { Topic } from '../../types';

export default {
  id: 'fastapi-inicio',
  icon: '⚡',
  title: 'Primer proyecto FastAPI',
  description:
    'FastAPI es un framework para crear APIs con Python: rápido, con validación automática gracias a los type hints y documentación interactiva generada sola en /docs. Aquí creas el proyecto con uv (el gestor de paquetes moderno de Python).',
  tip: 'Abre http://localhost:8000/docs: FastAPI genera una documentación interactiva (Swagger) donde puedes probar cada endpoint sin Postman.',

  snippets: [
    {
      title: '1. Crear el proyecto con uv',
      files: [
        {
          name: 'terminal',
          lang: 'bash',
          code: `# Instalar uv (una sola vez) → https://docs.astral.sh/uv/
curl -LsSf https://astral.sh/uv/install.sh | sh          # macOS / Linux
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"  # Windows

# Crear el proyecto (crea pyproject.toml, .venv y .python-version)
uv init mi-api
cd mi-api

# Añadir FastAPI con sus extras (servidor uvicorn, CLI, validación de emails…)
uv add "fastapi[standard]"

# Arrancar en modo desarrollo (recarga al guardar)
uv run fastapi dev app/main.py`,
        },
        {
          name: 'con pip (alternativa clásica)',
          lang: 'bash',
          code: `python -m venv .venv
source .venv/bin/activate        # Windows: .venv\\Scripts\\activate
pip install "fastapi[standard]"
pip freeze > requirements.txt
fastapi dev app/main.py`,
        },
      ],
    },
    {
      title: '2. Hola mundo',
      files: [
        {
          name: 'app/main.py',
          lang: 'python',
          code: `from fastapi import FastAPI

app = FastAPI(title="Mi API", version="1.0.0")


@app.get("/")
def root() -> dict[str, str]:
    return {"message": "¡Hola desde FastAPI! 🚀"}


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}`,
        },
        {
          name: 'terminal',
          lang: 'bash',
          code: `uv run fastapi dev app/main.py
#  Serving at: http://127.0.0.1:8000
#  API docs:   http://127.0.0.1:8000/docs

curl http://127.0.0.1:8000/
# {"message":"¡Hola desde FastAPI! 🚀"}`,
        },
      ],
    },
    {
      title: '3. Un CRUD en memoria para entender lo básico',
      lang: 'python',
      code: `from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel

app = FastAPI()


class TaskIn(BaseModel):          # lo que envía el cliente
    title: str
    done: bool = False


class Task(TaskIn):               # lo que devuelve la API (con id)
    id: int


tasks: dict[int, Task] = {}
next_id = 1


@app.get("/tasks")
def list_tasks() -> list[Task]:
    return list(tasks.values())


@app.post("/tasks", status_code=status.HTTP_201_CREATED)
def create_task(data: TaskIn) -> Task:
    global next_id
    task = Task(id=next_id, **data.model_dump())
    tasks[task.id] = task
    next_id += 1
    return task


@app.get("/tasks/{task_id}")
def get_task(task_id: int) -> Task:            # task_id se convierte a int automáticamente
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")
    return tasks[task_id]


@app.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int) -> None:
    if tasks.pop(task_id, None) is None:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")`,
    },
    {
      title: '4. Estructura de un proyecto real',
      lang: 'text',
      code: `mi-api/
├── pyproject.toml          # dependencias y configuración (lo gestiona uv)
├── uv.lock                 # versiones exactas instaladas
├── .env
├── alembic.ini             # migraciones
├── alembic/
├── app/
│   ├── __init__.py
│   ├── main.py             # crea la app e incluye los routers
│   ├── core/
│   │   ├── config.py       # variables de entorno (pydantic-settings)
│   │   └── security.py     # hash de contraseñas y JWT
│   ├── db/
│   │   ├── base.py         # Base de SQLAlchemy
│   │   └── session.py      # engine y get_db
│   ├── models/             # tablas (SQLAlchemy)
│   ├── schemas/            # entrada/salida de la API (Pydantic)
│   ├── services/           # lógica de negocio
│   └── api/
│       ├── deps.py         # dependencias comunes (usuario actual, sesión…)
│       └── routes/
│           ├── auth.py
│           ├── products.py
│           └── users.py
└── tests/`,
    },
  ],
} satisfies Topic;
