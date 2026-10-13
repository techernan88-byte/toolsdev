/**
 * Muestra el breakpoint activo de la ventana.
 * Solo una etiqueta es visible a la vez gracias a hidden / sm:inline / md:hidden...
 */
export default function BreakpointBadge() {
  return (
    <span className="rounded-full bg-zinc-900 px-3 py-1 font-mono text-xs whitespace-nowrap text-zinc-300 ring-1 ring-zinc-700">
      pantalla: <span className="text-emerald-400 sm:hidden">base (&lt;640px)</span>
      <span className="hidden text-emerald-400 sm:inline md:hidden">sm (≥640px)</span>
      <span className="hidden text-emerald-400 md:inline lg:hidden">md (≥768px)</span>
      <span className="hidden text-emerald-400 lg:inline xl:hidden">lg (≥1024px)</span>
      <span className="hidden text-emerald-400 xl:inline">xl (≥1280px)</span>
    </span>
  );
}
