import type { Topic } from '../../types';

export default {
  id: 'conflictos',
  icon: '⚔️',
  title: 'Resolver conflictos',
  description:
    'Un conflicto ocurre cuando dos ramas cambian las MISMAS líneas de un archivo y Git no sabe cuál quedarse. No es un error: Git marca las zonas en conflicto y te pide que decidas tú.',
  tip: 'Los conflictos se reducen con ramas cortas (pocos días), integrando develop/main en tu rama a menudo y con commits pequeños.',

  snippets: [
    {
      title: 'Cómo se ve un conflicto',
      lang: 'text',
      code: `$ git merge feature/precios
Auto-merging src/cart.ts
CONFLICT (content): Merge conflict in src/cart.ts
Automatic merge failed; fix conflicts and then commit the result.

── src/cart.ts ─────────────────────────────────────────────
export function total(items: Item[]) {
<<<<<<< HEAD                                    ← lo que hay en TU rama (main)
  return items.reduce((sum, i) => sum + i.price, 0);
=======
  return items.reduce((sum, i) => sum + i.price * i.qty, 0) * 1.21;
>>>>>>> feature/precios                         ← lo que viene de la otra rama
}`,
    },
    {
      title: 'Pasos para resolverlo',
      lang: 'bash',
      code: `# 1. Ver qué archivos tienen conflicto
git status                     # "both modified: src/cart.ts"

# 2. Editar cada archivo: dejar el código correcto y BORRAR las marcas <<<<<<< ======= >>>>>>>
#    (VS Code muestra botones: Accept Current / Accept Incoming / Accept Both)

# 3. Marcar como resuelto y terminar el merge
git add src/cart.ts
git commit                     # Git propone el mensaje "Merge branch 'feature/precios'"

# ¿Te has liado? Cancela y vuelve al estado anterior al merge
git merge --abort

# Quedarse entera con una de las dos versiones de un archivo
git checkout --ours   src/cart.ts     # la de tu rama
git checkout --theirs src/cart.ts     # la de la otra rama`,
    },
    {
      title: 'Prevenir conflictos: actualizar tu rama a menudo',
      lang: 'bash',
      code: `# Estás en feature/login y develop ha avanzado mucho

# Opción A: traer develop a tu rama con merge (seguro, añade un commit de merge)
git switch feature/login
git fetch origin
git merge origin/develop

# Opción B: rebase (historial lineal; solo si la rama es SOLO tuya)
git rebase origin/develop
# si hay conflictos: resolver → git add archivo → git rebase --continue
# para cancelar: git rebase --abort

git push --force-with-lease     # tras un rebase hay que forzar el push (de forma segura)`,
    },
  ],
} satisfies Topic;
