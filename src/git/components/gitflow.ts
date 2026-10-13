/**
 * Lógica del simulador de GitFlow (sin React): un reducer que, para cada acción,
 * crea los commits/merges en el grafo y anota los comandos de git equivalentes.
 */

export type Lane = 'main' | 'hotfix' | 'release' | 'develop' | 'feature';

/** Orden de las ramas de arriba a abajo en el dibujo */
export const LANES: Lane[] = ['main', 'hotfix', 'release', 'develop', 'feature'];

export interface Commit {
  id: number;
  lane: Lane;
  parents: number[];
  message: string;
  tag?: string;
}

interface Version {
  major: number;
  minor: number;
  patch: number;
}

export interface GitFlowState {
  commits: Commit[];
  /** Último commit de cada rama abierta */
  heads: Partial<Record<Lane, number>>;
  /** Nombre completo de las ramas temporales abiertas (feature/…, release/…, hotfix/…) */
  names: Partial<Record<Lane, string>>;
  version: Version;
  featureCount: number;
  commands: string[];
  lastAction: string;
}

export type GitFlowAction =
  | { type: 'startFeature' }
  | { type: 'commitFeature' }
  | { type: 'finishFeature' }
  | { type: 'startRelease' }
  | { type: 'finishRelease' }
  | { type: 'startHotfix' }
  | { type: 'finishHotfix' }
  | { type: 'reset' };

const versionText = ({ major, minor, patch }: Version) => `${major}.${minor}.${patch}`;

export const initialState: GitFlowState = {
  commits: [
    { id: 0, lane: 'main', parents: [], message: 'Versión inicial', tag: 'v1.0.0' },
    { id: 1, lane: 'develop', parents: [0], message: 'Crear develop' },
  ],
  heads: { main: 0, develop: 1 },
  names: {},
  version: { major: 1, minor: 0, patch: 0 },
  featureCount: 0,
  commands: [
    'git init',
    'git commit -m "Versión inicial"',
    'git tag -a v1.0.0 -m "v1.0.0"',
    'git switch -c develop',
    'git push -u origin main develop',
  ],
  lastAction: 'Repositorio creado: "main" tiene la v1.0.0 y "develop" es la rama de integración.',
};

/** Añade un commit a una rama y mueve su head */
function addCommit(
  state: GitFlowState,
  lane: Lane,
  parents: number[],
  message: string,
  tag?: string
): GitFlowState {
  const commit: Commit = { id: state.commits.length, lane, parents, message, tag };
  return { ...state, commits: [...state.commits, commit], heads: { ...state.heads, [lane]: commit.id } };
}

/** Cierra una rama temporal */
function closeBranch(state: GitFlowState, lane: Lane): GitFlowState {
  const { [lane]: _head, ...heads } = state.heads;
  const { [lane]: _name, ...names } = state.names;
  return { ...state, heads, names };
}

/** ¿La rama tiene ya algún commit propio? (si no, su head es el commit de la rama de origen) */
export const hasOwnCommits = (state: GitFlowState, lane: Lane) => {
  const head = state.heads[lane];
  return head !== undefined && state.commits[head]?.lane === lane;
};

export function gitFlowReducer(state: GitFlowState, action: GitFlowAction): GitFlowState {
  switch (action.type) {
    case 'startFeature': {
      const name = `feature/tarea-${state.featureCount + 1}`;
      return {
        ...state,
        featureCount: state.featureCount + 1,
        heads: { ...state.heads, feature: state.heads.develop },
        names: { ...state.names, feature: name },
        commands: [...state.commands, `git switch develop && git pull`, `git switch -c ${name}`],
        lastAction: `Nueva rama ${name} creada desde develop. Ahí se programa la funcionalidad.`,
      };
    }

    case 'commitFeature': {
      const next = addCommit(state, 'feature', [state.heads.feature!], 'Avance de la funcionalidad');
      return {
        ...next,
        commands: [...state.commands, 'git add .', 'git commit -m "feat: avance de la funcionalidad"'],
        lastAction: `Commit en ${state.names.feature}. Puedes hacer varios antes de terminar.`,
      };
    }

    case 'finishFeature': {
      const name = state.names.feature!;
      const merged = addCommit(
        state,
        'develop',
        [state.heads.develop!, state.heads.feature!],
        `Merge ${name}`
      );
      return {
        ...closeBranch(merged, 'feature'),
        commands: [
          ...state.commands,
          `git push -u origin ${name}   # → abrir Pull Request hacia develop`,
          'git switch develop',
          `git merge --no-ff ${name}`,
          `git branch -d ${name}`,
        ],
        lastAction: `${name} integrada en develop con --no-ff (queda un commit de merge que agrupa la funcionalidad).`,
      };
    }

    case 'startRelease': {
      const next = { ...state.version, minor: state.version.minor + 1, patch: 0 };
      const name = `release/${versionText(next)}`;
      const withBranch = {
        ...state,
        heads: { ...state.heads, release: state.heads.develop },
        names: { ...state.names, release: name },
      };
      const bumped = addCommit(
        withBranch,
        'release',
        [state.heads.develop!],
        `Subir versión a ${versionText(next)}`
      );
      return {
        ...bumped,
        commands: [
          ...state.commands,
          `git switch -c ${name} develop`,
          `npm version ${versionText(next)} --no-git-tag-version`,
          `git commit -am "chore(release): ${versionText(next)}"`,
        ],
        lastAction: `${name} congela lo que hay en develop. Aquí solo se corrigen bugs y se prepara la versión; develop sigue recibiendo features.`,
      };
    }

    case 'finishRelease': {
      const name = state.names.release!;
      const version = { ...state.version, minor: state.version.minor + 1, patch: 0 };
      const tag = `v${versionText(version)}`;
      let next = addCommit(state, 'main', [state.heads.main!, state.heads.release!], `Merge ${name}`, tag);
      next = addCommit(
        next,
        'develop',
        [state.heads.develop!, state.heads.release!],
        `Merge ${name} en develop`
      );
      return {
        ...closeBranch(next, 'release'),
        version,
        commands: [
          ...state.commands,
          'git switch main',
          `git merge --no-ff ${name}`,
          `git tag -a ${tag} -m "Versión ${versionText(version)}"`,
          'git switch develop',
          `git merge --no-ff ${name}   # los arreglos de la release vuelven a develop`,
          `git branch -d ${name}`,
          'git push origin main develop --tags',
        ],
        lastAction: `🚀 Publicada la ${tag}: la release se une a main (con tag) y TAMBIÉN a develop para no perder los arreglos.`,
      };
    }

    case 'startHotfix': {
      const next = { ...state.version, patch: state.version.patch + 1 };
      const name = `hotfix/${versionText(next)}`;
      const withBranch = {
        ...state,
        heads: { ...state.heads, hotfix: state.heads.main },
        names: { ...state.names, hotfix: name },
      };
      const fixed = addCommit(
        withBranch,
        'hotfix',
        [state.heads.main!],
        'Arreglar bug urgente en producción'
      );
      return {
        ...fixed,
        commands: [
          ...state.commands,
          `git switch -c ${name} main`,
          `git commit -am "fix: error crítico en el pago"`,
        ],
        lastAction: `🔥 Bug en producción: ${name} sale de main (el código que está publicado), no de develop.`,
      };
    }

    case 'finishHotfix': {
      const name = state.names.hotfix!;
      const version = { ...state.version, patch: state.version.patch + 1 };
      const tag = `v${versionText(version)}`;
      // Regla de GitFlow: si hay una release abierta, el arreglo va a la release
      // (que luego llegará a develop); si no, directamente a develop.
      const target: Lane = state.names.release ? 'release' : 'develop';
      const targetName = state.names.release ?? 'develop';

      let next = addCommit(state, 'main', [state.heads.main!, state.heads.hotfix!], `Merge ${name}`, tag);
      next = addCommit(
        next,
        target,
        [state.heads[target]!, state.heads.hotfix!],
        `Merge ${name} en ${targetName}`
      );
      return {
        ...closeBranch(next, 'hotfix'),
        version,
        commands: [
          ...state.commands,
          'git switch main',
          `git merge --no-ff ${name}`,
          `git tag -a ${tag} -m "Hotfix ${versionText(version)}"`,
          `git switch ${targetName}`,
          `git merge --no-ff ${name}`,
          `git branch -d ${name}`,
          `git push origin main ${targetName} --tags`,
        ],
        lastAction:
          target === 'release'
            ? `✅ ${tag} publicada. Como hay una release abierta, el arreglo entra en ${targetName} (llegará a develop al terminarla).`
            : `✅ ${tag} publicada. El arreglo también entra en develop para que la próxima versión no recupere el bug.`,
      };
    }

    case 'reset':
      return initialState;
  }
}
