import Sidebar from './components/layout/Sidebar';
import SectionPager from './components/layout/SectionPager';
import BreakpointBadge from './tailwind/components/BreakpointBadge';
import { CATEGORIES } from './categories';
import { useHashRoute } from './hooks/useHashRoute';
import { cx } from './utils/cx';

export default function App() {
  const { category, section, navigate } = useHashRoute(CATEGORIES);
  const index = category.sections.indexOf(section);
  const selectSection = (sectionId: string) => navigate(category.id, sectionId);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200">
      <header className="sticky top-0 z-20 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex min-w-0 items-center gap-4">
            <h1 className="hidden text-lg font-bold whitespace-nowrap text-white md:block">
              ⚡ Dev <span className="text-sky-400">Playground</span>
            </h1>
            <nav className="inline-flex overflow-x-auto rounded-lg bg-zinc-900 p-1 ring-1 ring-zinc-800">
              {CATEGORIES.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={cx(
                    'rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition',
                    item.id === category.id ? 'bg-sky-500 text-white' : 'text-zinc-400 hover:text-zinc-100'
                  )}
                >
                  {item.icon} {item.label}
                </button>
              ))}
            </nav>
          </div>
          {category.id === 'tailwind' && <BreakpointBadge />}
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row">
        {/* key: al cambiar de categoría el buscador se reinicia */}
        <Sidebar
          key={category.id}
          sections={category.sections}
          activeId={section.id}
          onSelect={selectSection}
        />
        <main className="min-w-0 flex-1 space-y-10">
          {category.renderSection(section.id)}
          <SectionPager
            prev={category.sections[index - 1]}
            next={category.sections[index + 1]}
            onSelect={selectSection}
          />
        </main>
      </div>
    </div>
  );
}
