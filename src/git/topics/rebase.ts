import type { Topic } from '../../types';

export default {
  id: 'rebase',
  icon: '🪄',
  title: 'Rebase, squash y cherry-pick',
  description:
    'rebase "reaplica" tus commits encima de otra rama, dejando un historial lineal. Con el rebase interactivo puedes juntar (squash), reordenar, renombrar o borrar commits antes de compartirlos. cherry-pick copia un commit concreto a otra rama.',
  tip: '⚠️ Regla de oro del rebase: nunca hagas rebase de commits que ya están en una rama compartida (main, develop). Úsalo solo en TUS ramas antes de abrir el Pull Request.',

  snippets: [
    {
      title: 'merge vs rebase',
      lang: 'text',
      code: `Situación:      A───B───E  main
                     \\
                      C───D  feature

git merge main  (desde feature)          git rebase main  (desde feature)
A───B───E                                 A───B───E  main
     \\     \\                                        \\
      C───D───M  feature                             C'───D'  feature

✅ No reescribe nada                      ✅ Historial lineal y limpio
❌ Historial con commits de merge         ❌ Reescribe commits (C', D' son nuevos)
→ Para ramas compartidas                  → Para tus ramas locales antes del PR`,
    },
    {
      title: 'Rebase interactivo: limpiar commits antes del Pull Request',
      lang: 'bash',
      code: `# Tienes estos commits en tu rama:
#   wip
#   arreglo
#   feat: formulario de registro
#   typo

git rebase -i HEAD~4            # o: git rebase -i origin/develop

# Se abre el editor con la lista (del más antiguo al más nuevo):
pick   a1b2c3d feat: formulario de registro
squash d4e5f6a wip                       # s = unir con el anterior
fixup  b7c8d9e arreglo                   # f = unir y descartar su mensaje
reword e1f2a3b typo                      # r = cambiar el mensaje
# drop = borrar · edit = parar para modificarlo · puedes reordenar líneas

# Resultado: 2 commits limpios. Como ya habías subido la rama:
git push --force-with-lease`,
    },
    {
      title: 'Squash al hacer merge y cherry-pick',
      lang: 'bash',
      code: `# Squash merge: todos los commits de la rama entran como UNO solo en main
git switch main
git merge --squash feature/registro
git commit -m "feat: registro de usuarios (#42)"
# (GitHub lo hace con el botón "Squash and merge")

# Cherry-pick: copiar un commit concreto a la rama actual
# Ej.: un arreglo hecho en develop que necesitas YA en la release
git switch release/1.4.0
git cherry-pick 3f2a1c9
git cherry-pick 3f2a1c9..8b7e6d5         # un rango de commits
git cherry-pick --abort                  # si hay conflictos y quieres cancelar`,
    },
    {
      title: 'Corregir un commit antiguo con fixup + autosquash',
      lang: 'bash',
      code: `# Te das cuenta de un error en un commit de hace 3 commits (a1b2c3d)
git add src/form.ts
git commit --fixup a1b2c3d              # crea "fixup! feat: formulario de registro"

git rebase -i --autosquash HEAD~5       # coloca y fusiona el fixup automáticamente
# (Consejo: git config --global rebase.autoSquash true)`,
    },
  ],
} satisfies Topic;
