import type { Topic } from '../../types';
import { file } from '../source';
import TarjetaDemo from '../examples/props/Tarjeta';
import AlertDemo from '../examples/props/Alert';

export default {
  id: 'props',
  icon: '📨',
  title: 'Props y composición',
  description:
    'Las props pasan datos de padre a hijo (en una sola dirección). Son de solo lectura: un componente nunca modifica sus props. Para que el hijo "avise" al padre, se le pasa una función (callback).',
  tip: 'Composición > configuración: en vez de 20 props, usa children o "slots" (props que reciben JSX) para que el padre decida el contenido.',

  snippets: [
    {
      title: 'Padre e hijo: datos hacia abajo, eventos hacia arriba',
      description:
        'El estado vive en el padre. El hijo recibe el valor y una función para pedir cambios ("lifting state up").',
      code: `import { useState } from 'react';

interface ColorPickerProps {
  colors: string[];
  selected: string;
  onSelect: (color: string) => void;
}

// Hijo: no tiene estado, solo pinta y avisa
function ColorPicker({ colors, selected, onSelect }: ColorPickerProps) {
  return (
    <div className="flex gap-2">
      {colors.map((color) => (
        <button
          key={color}
          onClick={() => onSelect(color)}
          style={{ background: color, outline: color === selected ? '3px solid white' : 'none' }}
          aria-label={color}
        />
      ))}
    </div>
  );
}

// Padre: dueño del estado
export function ThemeEditor() {
  const [color, setColor] = useState('tomato');

  return (
    <section>
      <h2 style={{ color }}>Color elegido: {color}</h2>
      <ColorPicker colors={['tomato', 'gold', 'teal']} selected={color} onSelect={setColor} />
    </section>
  );
}`,
    },
    {
      title: '❌ Errores típicos con props',
      code: `// ❌ Mutar una prop
function Bad({ user }: { user: { name: string } }) {
  user.name = 'Otro';          // ¡nunca! las props son de solo lectura
  return <p>{user.name}</p>;
}

// ❌ Copiar una prop en el estado (se queda desactualizada si el padre cambia)
function Bad2({ initialName }: { initialName: string }) {
  const [name] = useState(initialName);   // solo lee el valor la PRIMERA vez
  return <p>{name}</p>;
}

// ✅ Úsala directamente, o si de verdad necesitas reiniciar el estado,
//    cambia la key desde el padre:  <Editor key={user.id} initialName={user.name} />

// ❌ Pasar el resultado en vez de la función
<Child onSave={save()} />      // se ejecuta al renderizar
// ✅
<Child onSave={save} />
<Child onSave={() => save(id)} />`,
    },
    {
      title: 'Slots: varias zonas personalizables',
      description:
        'Además de children, puedes recibir JSX en props con nombre (header, actions, sidebar...).',
      code: `import type { ReactNode } from 'react';

interface PageLayoutProps {
  title: string;
  actions?: ReactNode;    // botones de la cabecera
  sidebar?: ReactNode;    // barra lateral opcional
  children: ReactNode;    // contenido principal
}

export function PageLayout({ title, actions, sidebar, children }: PageLayoutProps) {
  return (
    <div className="page">
      <header className="flex justify-between">
        <h1>{title}</h1>
        <div>{actions}</div>
      </header>
      <div className="flex gap-6">
        {sidebar && <aside className="w-60">{sidebar}</aside>}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

// Uso
<PageLayout
  title="Clientes"
  actions={<button>+ Nuevo cliente</button>}
  sidebar={<nav>Filtros…</nav>}
>
  <CustomersTable />
</PageLayout>`,
    },
    {
      title: 'Props polimórficas: el mismo componente como <button> o <a>',
      code: `import type { ComponentProps } from 'react';

type ButtonAsButton = ComponentProps<'button'> & { href?: never };
type ButtonAsLink = ComponentProps<'a'> & { href: string };
type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button(props: ButtonProps) {
  const className = 'rounded-lg bg-sky-500 px-4 py-2 text-white';

  // Si tiene href se renderiza como enlace; TS sabe qué props hay en cada caso
  if (props.href !== undefined) {
    return <a className={className} {...props} />;
  }
  return <button className={className} {...props} />;
}

<Button onClick={() => alert('hola')}>Soy un botón</Button>
<Button href="/docs">Soy un enlace</Button>`,
    },
  ],

  examples: [
    {
      title: 'Tarjetas con children',
      level: 'estudiante',
      description: 'Interface de props, valores por defecto y children: ReactNode.',
      Component: TarjetaDemo,
      files: [file('props/Tarjeta.tsx')],
    },
    {
      title: 'Componente Alert con variantes',
      level: 'industria',
      description: 'Record<Variant, ...>, props opcionales y callback onClose.',
      Component: AlertDemo,
      files: [file('props/Alert.tsx')],
    },
  ],
} satisfies Topic;
