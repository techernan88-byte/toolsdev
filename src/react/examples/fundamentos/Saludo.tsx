// Un componente es una función que devuelve JSX.
// Dentro del JSX usamos { } para insertar cualquier expresión de JavaScript.
export default function Saludo() {
  const nombre: string = 'Ada';
  const hora = new Date().getHours(); // TypeScript infiere: number
  const momento = hora < 12 ? 'Buenos días' : hora < 20 ? 'Buenas tardes' : 'Buenas noches';
  const tecnologias: string[] = ['TypeScript', 'React', 'Tailwind'];

  return (
    <div className="space-y-2">
      <h3 className="text-xl font-bold text-white">
        {momento}, {nombre} 👋
      </h3>
      <p className="text-zinc-400">
        Hoy es {new Date().toLocaleDateString('es')} y tienes {tecnologias.length} tecnologías por aprender.
      </p>
      {/* En JSX se usa className (no class) y style recibe un objeto */}
      <p className="text-sky-400" style={{ letterSpacing: '0.1em' }}>
        {tecnologias.join(' · ')}
      </p>
    </div>
  );
}
