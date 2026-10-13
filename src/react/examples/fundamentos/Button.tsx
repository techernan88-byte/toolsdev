import { useState, type ComponentProps } from 'react';

// Botón reutilizable estilo "design system":
// - ComponentProps<'button'> hereda TODOS los atributos nativos con su tipo.
// - Variantes y tamaños en objetos tipados (lookup tables) en lugar de if/else.
// - keyof typeof VARIANTS crea el tipo 'primary' | 'secondary' | ... automáticamente.

const VARIANTS = {
  primary: 'bg-sky-500 text-white hover:bg-sky-400',
  secondary: 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700',
  danger: 'bg-rose-600 text-white hover:bg-rose-500',
  ghost: 'text-zinc-300 hover:bg-white/5',
};

const SIZES = {
  sm: 'px-2.5 py-1 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

interface ButtonProps extends ComponentProps<'button'> {
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  isLoading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={isLoading || disabled}
      className={`inline-flex items-center gap-2 rounded-lg font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
    >
      {isLoading && (
        <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}

// Uso del componente
export default function ButtonDemo() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button onClick={handleSave} isLoading={isSaving}>
        {isSaving ? 'Guardando…' : 'Guardar'}
      </Button>
      <Button variant="secondary">Cancelar</Button>
      <Button variant="danger" size="sm">
        Eliminar
      </Button>
      <Button variant="ghost" size="lg">
        Ghost grande
      </Button>
      <Button disabled>Deshabilitado</Button>
      {/* <Button variant="rojo" /> ❌ TypeScript marca el error: no existe esa variante */}
    </div>
  );
}
