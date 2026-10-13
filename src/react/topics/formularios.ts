import type { Topic } from '../../types';
import { file } from '../source';
import ControlledInput from '../examples/formularios/ControlledInput';
import SignupForm from '../examples/formularios/SignupForm';

export default {
  id: 'formularios',
  icon: '📝',
  title: 'Eventos y formularios',
  description:
    'Los eventos se escriben en camelCase (onClick, onChange, onSubmit) y reciben una función. En formularios, un input "controlado" toma su valor del estado y lo actualiza con onChange.',
  tip: 'onClick={guardar} ✅ pasa la función. onClick={guardar()} ❌ la ejecuta al renderizar.',

  snippets: [
    {
      title: 'Formulario controlado con un solo handleChange',
      code: `import { useState, type ChangeEvent, type FormEvent } from 'react';

interface ContactForm {
  name: string;
  email: string;
  topic: 'soporte' | 'ventas' | 'otro';
  message: string;
  newsletter: boolean;
}

const INITIAL: ContactForm = { name: '', email: '', topic: 'soporte', message: '', newsletter: false };

export function ContactForm() {
  const [form, setForm] = useState<ContactForm>(INITIAL);

  // Sirve para input, select, textarea y checkbox gracias al atributo "name"
  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = event.target;
    const newValue = type === 'checkbox' ? (event.target as HTMLInputElement).checked : value;
    setForm((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();               // evita que la página se recargue
    console.log('Enviando', form);
    setForm(INITIAL);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={form.name} onChange={handleChange} required />
      <input name="email" type="email" value={form.email} onChange={handleChange} required />
      <select name="topic" value={form.topic} onChange={handleChange}>
        <option value="soporte">Soporte</option>
        <option value="ventas">Ventas</option>
        <option value="otro">Otro</option>
      </select>
      <textarea name="message" value={form.message} onChange={handleChange} />
      <label>
        <input name="newsletter" type="checkbox" checked={form.newsletter} onChange={handleChange} />
        Suscribirme
      </label>
      <button>Enviar</button>
    </form>
  );
}`,
    },
    {
      title: 'Formulario NO controlado con FormData',
      description: 'Más simple cuando solo necesitas los valores al enviar (sin validar en cada tecla).',
      code: `import type { FormEvent } from 'react';

export function QuickForm() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const data = {
      title: String(formData.get('title')),
      priority: Number(formData.get('priority')),
      tags: formData.getAll('tags').map(String),   // varios checkbox con el mismo name
    };
    console.log(data);
    event.currentTarget.reset();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" defaultValue="Nueva tarea" />
      <input name="priority" type="number" defaultValue={1} />
      <label><input type="checkbox" name="tags" value="urgente" /> Urgente</label>
      <label><input type="checkbox" name="tags" value="bug" /> Bug</label>
      <button>Crear</button>
    </form>
  );
}`,
    },
    {
      title: 'En la industria: React Hook Form + Zod',
      description:
        'El estándar para formularios grandes: menos re-renders, validación declarativa y tipos generados desde el esquema.',
      files: [
        {
          name: 'terminal',
          lang: 'bash',
          code: 'npm install react-hook-form zod @hookform/resolvers',
        },
        {
          name: 'SignupForm.tsx',
          code: `import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// 1. El esquema define las reglas…
const signupSchema = z
  .object({
    name: z.string().min(2, 'Mínimo 2 caracteres'),
    email: z.email('Correo no válido'),
    password: z.string().min(8, 'Mínimo 8 caracteres'),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: 'Las contraseñas no coinciden',
    path: ['confirm'],
  });

// 2. …y el tipo se GENERA a partir del esquema (no lo escribes dos veces)
type SignupData = z.infer<typeof signupSchema>;

export function SignupForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignupData>({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (data: SignupData) => {
    await fetch('/api/signup', { method: 'POST', body: JSON.stringify(data) });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <input {...register('name')} placeholder="Nombre" />
      {errors.name && <p>{errors.name.message}</p>}

      <input {...register('email')} placeholder="Correo" />
      {errors.email && <p>{errors.email.message}</p>}

      <input type="password" {...register('password')} placeholder="Contraseña" />
      {errors.password && <p>{errors.password.message}</p>}

      <input type="password" {...register('confirm')} placeholder="Repite la contraseña" />
      {errors.confirm && <p>{errors.confirm.message}</p>}

      <button disabled={isSubmitting}>{isSubmitting ? 'Enviando…' : 'Crear cuenta'}</button>
    </form>
  );
}`,
        },
      ],
    },
  ],

  examples: [
    {
      title: 'Input controlado',
      level: 'estudiante',
      description: 'value + onChange con input y select tipado.',
      Component: ControlledInput,
      files: [file('formularios/ControlledInput.tsx')],
    },
    {
      title: 'Registro con validación',
      level: 'industria',
      description:
        'Tipos para valores y errores, validación pura, errores derivados, campos "touched" y envío asíncrono.',
      Component: SignupForm,
      files: [file('formularios/SignupForm.tsx')],
    },
  ],
} satisfies Topic;
