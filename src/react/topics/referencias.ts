import type { Topic } from '../../types';
import { file } from '../source';
import FocusInput from '../examples/referencias/FocusInput';
import Stopwatch from '../examples/referencias/Stopwatch';

export default {
  id: 'use-ref',
  icon: '📌',
  title: 'useRef',
  description:
    'useRef guarda un valor que persiste entre renders SIN provocar un nuevo render al cambiar. Se usa para acceder al DOM (focus, scroll, medidas) o guardar datos internos como ids de temporizadores.',
  tip: '¿Se ve en pantalla? → useState. ¿Es un dato interno que no se muestra? → useRef.',

  snippets: [
    {
      title: 'Chat: scroll automático al último mensaje',
      code: `import { useEffect, useRef } from 'react';

interface Message {
  id: string;
  text: string;
}

export function ChatWindow({ messages }: { messages: Message[] }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Cada vez que llega un mensaje, baja hasta el final
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  return (
    <div className="h-80 overflow-y-auto">
      {messages.map((message) => (
        <p key={message.id}>{message.text}</p>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}`,
    },
    {
      title: 'Medir un elemento y reproducir un vídeo',
      code: `import { useLayoutEffect, useRef, useState } from 'react';

export function VideoPlayer({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  // useLayoutEffect: mide ANTES de que el navegador pinte (sin parpadeos)
  useLayoutEffect(() => {
    if (boxRef.current) setWidth(boxRef.current.getBoundingClientRect().width);
  }, []);

  return (
    <div ref={boxRef}>
      <video ref={videoRef} src={src} />
      <button onClick={() => videoRef.current?.play()}>▶️</button>
      <button onClick={() => videoRef.current?.pause()}>⏸️</button>
      <p>Ancho del reproductor: {width}px</p>
    </div>
  );
}`,
    },
    {
      title: 'React 19: ref como prop normal (adiós forwardRef)',
      code: `import { useRef, type ComponentProps } from 'react';

// En React 19 "ref" llega como cualquier otra prop
function TextField({ label, ref, ...props }: ComponentProps<'input'> & { label: string }) {
  return (
    <label>
      {label}
      <input ref={ref} {...props} />
    </label>
  );
}

export function LoginForm() {
  const emailRef = useRef<HTMLInputElement>(null);

  return (
    <form>
      <TextField label="Correo" ref={emailRef} />
      <button type="button" onClick={() => emailRef.current?.focus()}>
        Ir al correo
      </button>
    </form>
  );
}

// Antes (React 18): const TextField = forwardRef<HTMLInputElement, Props>((props, ref) => ...)`,
    },
    {
      title: 'Guardar el valor anterior',
      code: `import { useEffect, useRef } from 'react';

// Hook: devuelve el valor que tenía la variable en el render anterior
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;   // se actualiza DESPUÉS de pintar
  }, [value]);
  return ref.current;
}

export function PriceTag({ price }: { price: number }) {
  const previous = usePrevious(price);
  const trend = previous === undefined ? '' : price > previous ? '📈' : price < previous ? '📉' : '';
  return <p>\${price} {trend}</p>;
}`,
    },
  ],

  examples: [
    {
      title: 'Enfocar un input',
      level: 'estudiante',
      description: 'useRef<HTMLInputElement> y acceso directo al DOM.',
      Component: FocusInput,
      files: [file('referencias/FocusInput.tsx')],
    },
    {
      title: 'Cronómetro con vueltas',
      level: 'industria',
      description: 'Refs para el intervalo y el tiempo de inicio; estado solo para lo visible.',
      Component: Stopwatch,
      files: [file('referencias/Stopwatch.tsx')],
    },
  ],
} satisfies Topic;
