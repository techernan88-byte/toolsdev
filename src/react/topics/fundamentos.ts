import type { Topic } from '../../types';
import { file } from '../source';
import Saludo from '../examples/fundamentos/Saludo';
import ButtonDemo from '../examples/fundamentos/Button';

export default {
  id: 'fundamentos',
  icon: '🧬',
  title: 'JSX y componentes',
  description:
    'Un componente es una función que devuelve JSX (HTML dentro de TypeScript). Su nombre empieza en Mayúscula y se usa como una etiqueta: <Saludo />. Los archivos con JSX usan la extensión .tsx.',
  tip: 'JSX solo puede devolver UN elemento raíz. Si necesitas varios, envuélvelos en un Fragment: <>...</>.',

  snippets: [
    {
      title: 'Crear un proyecto React + TypeScript',
      description:
        'Vite crea el proyecto con TypeScript, ESLint y el servidor de desarrollo ya configurados.',
      files: [
        {
          name: 'terminal',
          lang: 'bash',
          code: `npm create vite@latest mi-app -- --template react-ts
cd mi-app
npm install
npm run dev          # servidor de desarrollo en http://localhost:5173
npm run build        # comprueba tipos (tsc) y genera /dist`,
        },
        {
          name: 'estructura',
          lang: 'text',
          code: `mi-app/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── main.tsx         # punto de entrada: monta <App /> en #root
    ├── App.tsx          # componente raíz
    ├── components/      # componentes reutilizables
    └── vite-env.d.ts    # tipos de Vite (import.meta.env, imports de assets...)`,
        },
        {
          name: 'main.tsx',
          code: `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// El "!" le dice a TS que #root existe seguro (no es null)
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);`,
        },
      ],
    },
    {
      title: 'JSX vs HTML: las diferencias que más se olvidan',
      code: `export function Diferencias() {
  const isDisabled = true;
  const color = 'tomato';

  return (
    // Fragment: agrupa sin añadir un <div> extra al DOM
    <>
      {/* 1. class → className */}
      <div className="caja">Hola</div>

      {/* 2. for → htmlFor */}
      <label htmlFor="email">Correo</label>
      <input id="email" type="email" />

      {/* 3. Etiquetas siempre cerradas: <img />, <br />, <input /> */}
      <img src="/logo.png" alt="Logo" />

      {/* 4. style es un OBJETO con propiedades en camelCase */}
      <p style={{ color, fontSize: 18, marginTop: '1rem' }}>Texto</p>

      {/* 5. Atributos booleanos y expresiones entre llaves */}
      <button disabled={isDisabled}>{isDisabled ? 'Espera' : 'Enviar'}</button>

      {/* 6. Eventos en camelCase y reciben una FUNCIÓN */}
      <button onClick={() => alert('clic')}>Clic</button>
    </>
  );
}`,
    },
    {
      title: 'Exportar e importar componentes',
      files: [
        {
          name: 'components/Button.tsx',
          code: `// Export nombrado (recomendado: el nombre es fijo y el editor lo autocompleta)
export function Button() {
  return <button>Botón</button>;
}

// Varios exports en el mismo archivo
export function IconButton() {
  return <button>⭐</button>;
}`,
        },
        {
          name: 'App.tsx',
          code: `import { Button, IconButton } from './components/Button';
import Header from './components/Header'; // export default: se puede renombrar al importar

export default function App() {
  return (
    <main>
      <Header />
      <Button />
      <IconButton />
    </main>
  );
}`,
        },
      ],
    },
    {
      title: 'Componente completo: tarjeta de perfil',
      description: 'Props tipadas, expresiones, condicionales, listas y eventos en un solo componente.',
      code: `interface ProfileCardProps {
  name: string;
  role: string;
  skills: string[];
  isOnline?: boolean;            // opcional
  onFollow: (name: string) => void;
}

export function ProfileCard({ name, role, skills, isOnline = false, onFollow }: ProfileCardProps) {
  const initials = name.split(' ').map((word) => word[0]).join('');

  return (
    <article className="card">
      <div className="avatar">
        {initials}
        {isOnline && <span className="online-dot" />}
      </div>

      <h2>{name}</h2>
      <p>{role.toUpperCase()}</p>

      <ul>
        {skills.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>

      <button onClick={() => onFollow(name)}>Seguir</button>
    </article>
  );
}

// Uso
<ProfileCard
  name="Ada Lovelace"
  role="Programadora"
  skills={['TypeScript', 'React']}
  isOnline
  onFollow={(name) => console.log('Siguiendo a', name)}
/>`,
    },
  ],

  examples: [
    {
      title: 'Expresiones en JSX',
      level: 'estudiante',
      description: 'Variables, operador ternario, métodos de arrays y estilos en línea.',
      Component: Saludo,
      files: [file('fundamentos/Saludo.tsx')],
    },
    {
      title: 'Botón reutilizable (design system)',
      level: 'industria',
      description:
        'ComponentProps<"button">, variantes tipadas con keyof typeof, estado de carga y ...props.',
      Component: ButtonDemo,
      files: [file('fundamentos/Button.tsx')],
    },
  ],
} satisfies Topic;
