import { useState, type ChangeEvent, type FocusEvent, type FormEvent, type ComponentProps } from 'react';

// Formulario de registro como en un proyecto real:
// - Tipos para los valores y los errores del formulario.
// - Un solo objeto de estado y un único handleChange (usa el atributo name).
// - Validación en una función pura, fuera del componente (fácil de testear).
// - Errores DERIVADOS: se calculan en cada render, no se guardan.
// - "touched": solo mostrar errores de campos que el usuario ya visitó.

interface FormValues {
  name: string;
  email: string;
  password: string;
  terms: boolean;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;
type Touched = Partial<Record<keyof FormValues, boolean>>;
type Status = 'idle' | 'submitting' | 'success';

const INITIAL_VALUES: FormValues = { name: '', email: '', password: '', terms: false };

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (values.name.trim().length < 2) errors.name = 'Mínimo 2 caracteres';
  if (!/^\S+@\S+\.\S+$/.test(values.email)) errors.email = 'Correo no válido';
  if (values.password.length < 8) errors.password = 'Mínimo 8 caracteres';
  if (!values.terms) errors.terms = 'Debes aceptar los términos';
  return errors;
}

// ✅ Los componentes se definen FUERA de otros componentes
interface FieldProps extends ComponentProps<'input'> {
  label: string;
  error?: string;
}

function Field({ label, error, ...inputProps }: FieldProps) {
  return (
    <label className="block">
      <span className="text-sm text-zinc-400">{label}</span>
      <input
        {...inputProps}
        className={`mt-1 w-full rounded-lg bg-zinc-800 px-3 py-2 text-white ring-1 outline-none focus:ring-2 ${
          error ? 'ring-rose-500 focus:ring-rose-500' : 'ring-transparent focus:ring-sky-500'
        }`}
      />
      {error && <span className="mt-1 block text-xs text-rose-400">{error}</span>}
    </label>
  );
}

export default function SignupForm() {
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [touched, setTouched] = useState<Touched>({});
  const [status, setStatus] = useState<Status>('idle');

  const errors = validate(values);
  const isValid = Object.keys(errors).length === 0;
  const errorFor = (field: keyof FormValues) => (touched[field] ? errors[field] : undefined);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setValues((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) =>
    setTouched((prev) => ({ ...prev, [event.target.name]: true }));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched({ name: true, email: true, password: true, terms: true });
    if (!isValid) return;

    setStatus('submitting');
    await new Promise((resolve) => setTimeout(resolve, 1200)); // simula la API
    setStatus('success');
  };

  const reset = () => {
    setValues(INITIAL_VALUES);
    setTouched({});
    setStatus('idle');
  };

  if (status === 'success') {
    return (
      <div className="max-w-sm space-y-3 rounded-xl bg-emerald-500/10 p-6 text-center ring-1 ring-emerald-500/30">
        <p className="text-3xl">🎉</p>
        <p className="font-semibold text-emerald-300">¡Bienvenido, {values.name}!</p>
        <button onClick={reset} className="text-sm text-zinc-400 hover:text-white">
          Registrar otra cuenta
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-sm space-y-3">
      <Field
        label="Nombre"
        name="name"
        value={values.name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errorFor('name')}
      />
      <Field
        label="Correo"
        name="email"
        type="email"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errorFor('email')}
      />
      <Field
        label="Contraseña"
        name="password"
        type="password"
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errorFor('password')}
      />

      <label className="flex items-center gap-2 text-sm text-zinc-400">
        <input
          type="checkbox"
          name="terms"
          checked={values.terms}
          onChange={handleChange}
          className="size-4 accent-sky-500"
        />
        Acepto los términos
      </label>
      {errorFor('terms') && <p className="text-xs text-rose-400">{errorFor('terms')}</p>}

      <button
        disabled={status === 'submitting'}
        className="w-full rounded-lg bg-sky-500 py-2 font-semibold text-white hover:bg-sky-400 disabled:opacity-50"
      >
        {status === 'submitting' ? 'Creando cuenta…' : 'Crear cuenta'}
      </button>
    </form>
  );
}
