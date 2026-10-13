import type { Topic } from '../../types';

export default {
  id: 'ramas',
  icon: '🌿',
  title: 'Ramas y merge',
  description:
    'Una rama es una línea de desarrollo independiente: puedes probar una funcionalidad sin romper la versión estable. Cuando está lista, se une (merge) a la rama principal. Crear ramas en Git es instantáneo y barato.',
  tip: 'Usa git switch para cambiar de rama y git restore para descartar cambios. Son los comandos modernos que sustituyen a los múltiples usos de git checkout.',

  snippets: [
    {
      title: 'Crear, cambiar, listar y borrar ramas',
      lang: 'bash',
      code: `git branch                       # ramas locales (* = la actual)
git branch -a                    # también las remotas
git branch -vv                   # con su último commit y la rama remota que siguen

git switch -c feature/login      # crear y cambiar a la nueva rama
git switch main                  # cambiar a una rama existente
git switch -                     # volver a la rama anterior

git branch -m nuevo-nombre       # renombrar la rama actual
git branch -d feature/login      # borrar (solo si ya está integrada)
git branch -D experimento        # borrar a la fuerza (pierdes sus commits)
git push origin --delete feature/login   # borrar la rama en el remoto`,
    },
    {
      title: 'Merge: unir una rama a otra',
      lang: 'bash',
      code: `# 1. Ve a la rama que RECIBE los cambios
git switch main
git pull

# 2. Une la rama de la funcionalidad
git merge feature/login

# 3. Sube y borra la rama ya integrada
git push
git branch -d feature/login`,
    },
    {
      title: 'Fast-forward vs. commit de merge',
      lang: 'text',
      code: `Antes:            A───B  main
                       \\
                        C───D  feature

1) git merge feature   (main no avanzó → "fast-forward": solo mueve el puntero)
                  A───B───C───D  main, feature

2) git merge --no-ff feature   (fuerza un commit de merge: se ve que hubo una rama)
                  A───B───────────M  main
                       \\         /
                        C───D───   feature

3) Si main TAMBIÉN avanzó, siempre hay commit de merge:
                  A───B───E───────M  main
                       \\         /
                        C───D───   feature`,
    },
    {
      title: 'Guardar cambios a medias: stash',
      description: 'Tienes cambios sin terminar y necesitas cambiar de rama urgentemente.',
      lang: 'bash',
      code: `git stash push -m "formulario a medias"   # guarda los cambios y deja el directorio limpio
git switch main                             # … arreglas lo urgente …
git switch feature/form

git stash list                              # stash@{0}: On feature/form: formulario a medias
git stash pop                               # recupera los cambios y borra el stash
git stash apply stash@{1}                   # recupera uno concreto sin borrarlo
git stash -u                                # incluye también los archivos nuevos (untracked)
git stash drop stash@{0}                    # borrar un stash`,
    },
  ],
} satisfies Topic;
