import type { Topic } from '../../types';
import { file } from '../source';
import ActionForm from '../examples/react19/ActionForm';
import OptimisticChat from '../examples/react19/OptimisticChat';
import UsePromise from '../examples/react19/UsePromise';

export default {
  id: 'react-19',
  icon: '🆕',
  title: 'Novedades React 19',
  description:
    'React 19 trae Actions para formularios (useActionState, useFormStatus), actualizaciones optimistas (useOptimistic), el hook use() para promesas y contexto, ref como prop normal y metadatos en componentes.',
  tip: 'Estas APIs brillan junto a frameworks con Server Actions (Next.js), pero también funcionan en el cliente como ves aquí.',

  snippets: [
    {
      title: 'Metadatos y recursos dentro de componentes',
      code: `export function BlogPost({ post }: { post: { title: string; summary: string; cover: string } }) {
  return (
    <article>
      {/* React 19 los "eleva" automáticamente al <head> */}
      <title>{post.title} | Mi Blog</title>
      <meta name="description" content={post.summary} />
      <meta property="og:image" content={post.cover} />
      <link rel="canonical" href={\`https://miblog.com/\${post.title}\`} />

      <h1>{post.title}</h1>
      <img src={post.cover} alt="" />
    </article>
  );
}`,
    },
    {
      title: 'use(): contexto condicional y promesas',
      code: `import { Suspense, use } from 'react';
import { ThemeContext } from './ThemeContext';

// use() puede ir dentro de un if (useContext no)
function Banner({ show }: { show: boolean }) {
  if (!show) return null;
  const theme = use(ThemeContext);
  return <div className={theme}>¡Oferta!</div>;
}

// use() con una promesa creada FUERA del componente (en un loader, en el padre, en caché)
function Comments({ commentsPromise }: { commentsPromise: Promise<{ id: number; text: string }[]> }) {
  const comments = use(commentsPromise);
  return <ul>{comments.map((c) => <li key={c.id}>{c.text}</li>)}</ul>;
}

export function PostPage({ commentsPromise }: { commentsPromise: Promise<{ id: number; text: string }[]> }) {
  return (
    <Suspense fallback={<p>Cargando comentarios…</p>}>
      <Comments commentsPromise={commentsPromise} />
    </Suspense>
  );
}`,
    },
    {
      title: 'Formulario de login con useActionState',
      code: `import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

interface LoginState {
  error?: string;
  email?: string;
}

async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));

  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) return { error: 'Correo o contraseña incorrectos', email };
  window.location.href = '/dashboard';
  return {};
}

function SubmitButton() {
  const { pending } = useFormStatus();   // lee el estado del <form> padre
  return <button disabled={pending}>{pending ? 'Entrando…' : 'Entrar'}</button>;
}

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, {});

  return (
    <form action={formAction}>
      <input name="email" type="email" defaultValue={state.email} required />
      <input name="password" type="password" required />
      {state.error && <p role="alert">{state.error}</p>}
      <SubmitButton />
    </form>
  );
}`,
    },
    {
      title: 'Like optimista con useOptimistic',
      code: `import { useOptimistic, useTransition } from 'react';

interface LikeButtonProps {
  postId: string;
  likes: number;
  likedByMe: boolean;
  onLiked: (likes: number, likedByMe: boolean) => void; // actualiza el estado real del padre
}

export function LikeButton({ postId, likes, likedByMe, onLiked }: LikeButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useOptimistic({ likes, likedByMe });

  const toggleLike = () => {
    startTransition(async () => {
      // 1. Cambia la UI al instante
      setOptimistic((current) => ({
        likedByMe: !current.likedByMe,
        likes: current.likes + (current.likedByMe ? -1 : 1),
      }));
      // 2. Petición real; si lanza error, React descarta el valor optimista
      const response = await fetch(\`/api/posts/\${postId}/like\`, { method: 'POST' });
      const data: { likes: number; likedByMe: boolean } = await response.json();
      onLiked(data.likes, data.likedByMe);
    });
  };

  return (
    <button onClick={toggleLike} aria-busy={isPending}>
      {optimistic.likedByMe ? '❤️' : '🤍'} {optimistic.likes}
    </button>
  );
}`,
    },
  ],

  examples: [
    {
      title: 'useActionState + useFormStatus',
      level: 'industria',
      description: 'Formulario sin preventDefault ni estado por campo, con el estado de la acción tipado.',
      Component: ActionForm,
      files: [file('react19/ActionForm.tsx')],
    },
    {
      title: 'useOptimistic: chat',
      level: 'industria',
      description: 'El mensaje aparece al instante; si falla, se revierte.',
      Component: OptimisticChat,
      files: [file('react19/OptimisticChat.tsx')],
    },
    {
      title: 'use() + Suspense',
      level: 'industria',
      description: 'Leer una promesa directamente en el render.',
      Component: UsePromise,
      files: [file('react19/UsePromise.tsx')],
    },
  ],
} satisfies Topic;
