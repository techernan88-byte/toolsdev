import type { Topic } from '../../types';

export default {
  id: 'buenos-commits',
  icon: '✍️',
  title: 'Buenos commits (Conventional Commits)',
  description:
    'Un buen historial se lee como un registro de decisiones. Conventional Commits es una convención para los mensajes (tipo(ámbito): descripción) que se usa en la mayoría de equipos y permite generar el CHANGELOG y la versión automáticamente.',
  tip: 'Escribe el mensaje en imperativo y explicando el QUÉ y el PORQUÉ, no el cómo (el cómo ya está en el código): "fix(cart): evitar total negativo con cupones".',

  snippets: [
    {
      title: 'Formato de Conventional Commits',
      lang: 'text',
      code: `<tipo>(<ámbito opcional>): <descripción corta, en imperativo, sin punto final>

<cuerpo opcional: qué y por qué, líneas de ~72 caracteres>

<pie opcional: BREAKING CHANGE, referencias a issues>

TIPOS
feat      nueva funcionalidad                  → sube la versión MINOR (1.2.0 → 1.3.0)
fix       corrección de un bug                 → sube la versión PATCH (1.2.0 → 1.2.1)
docs      solo documentación
style     formato (espacios, comas…), sin cambiar la lógica
refactor  cambio de código que no añade funcionalidad ni corrige bugs
perf      mejora de rendimiento
test      añadir o corregir tests
build     sistema de build o dependencias (npm, Docker…)
ci        configuración de CI (GitHub Actions…)
chore     tareas de mantenimiento
"!" o "BREAKING CHANGE:"  cambio incompatible  → sube la versión MAJOR (1.2.0 → 2.0.0)`,
    },
    {
      title: 'Ejemplos buenos y malos',
      lang: 'text',
      code: `❌ "cambios"                    ❌ "arreglado"            ❌ "WIP"
❌ "fix bug"                    ❌ "actualizar archivos"   ❌ "commit del viernes"

✅ feat(auth): añadir inicio de sesión con Google
✅ fix(cart): evitar total negativo al aplicar varios cupones
✅ docs(readme): explicar cómo arrancar el proyecto con Docker
✅ refactor(api): extraer el cliente HTTP a lib/http.ts
✅ perf(products): paginar el listado en el servidor
✅ test(orders): cubrir la creación de pedidos sin stock

✅ feat(api)!: cambiar /users por /v2/users

   El endpoint antiguo devolvía la contraseña hasheada. La nueva versión
   usa el esquema PublicUser.

   BREAKING CHANGE: los clientes deben migrar a /v2/users.
   Closes #128`,
    },
    {
      title: 'Hacer que se cumpla: commitlint + husky',
      lang: 'bash',
      code: `npm install -D @commitlint/cli @commitlint/config-conventional husky

# Configuración de commitlint
echo "export default { extends: ['@commitlint/config-conventional'] };" > commitlint.config.js

# Hooks de git con husky
npx husky init
echo "npx --no -- commitlint --edit \\$1" > .husky/commit-msg
echo "npm run lint && npm test" > .husky/pre-commit

# Ahora un mensaje incorrecto se rechaza:
git commit -m "cambios"
# ✖ subject may not be empty
# ✖ type may not be empty`,
    },
  ],
} satisfies Topic;
