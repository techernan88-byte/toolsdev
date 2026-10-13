import { createContext, useContext, useState, type ReactNode } from 'react';

// Compound components: varios componentes que trabajan juntos y comparten
// estado por contexto. Así lo hacen librerías como Radix UI o Headless UI.
// Uso:  <Tabs> <Tabs.List> <Tabs.Tab/> </Tabs.List> <Tabs.Panel/> </Tabs>

interface TabsContextValue {
  active: string;
  setActive: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs() {
  const context = useContext(TabsContext);
  if (!context) throw new Error('Los componentes Tabs.* deben estar dentro de <Tabs>');
  return context;
}

function Tabs({ defaultValue, children }: { defaultValue: string; children: ReactNode }) {
  const [active, setActive] = useState(defaultValue);
  return <TabsContext value={{ active, setActive }}>{children}</TabsContext>;
}

function List({ children }: { children: ReactNode }) {
  return (
    <div role="tablist" className="flex gap-1 border-b border-white/10">
      {children}
    </div>
  );
}

function Tab({ value, children }: { value: string; children: ReactNode }) {
  const { active, setActive } = useTabs();
  const isActive = active === value;
  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={() => setActive(value)}
      className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium ${isActive ? 'border-sky-400 text-sky-300' : 'border-transparent text-zinc-400 hover:text-white'}`}
    >
      {children}
    </button>
  );
}

function Panel({ value, children }: { value: string; children: ReactNode }) {
  const { active } = useTabs();
  return active === value ? (
    <div role="tabpanel" className="pt-4 text-zinc-300">
      {children}
    </div>
  ) : null;
}

Tabs.List = List;
Tabs.Tab = Tab;
Tabs.Panel = Panel;

export default function TabsDemo() {
  return (
    <Tabs defaultValue="perfil">
      <Tabs.List>
        <Tabs.Tab value="perfil">👤 Perfil</Tabs.Tab>
        <Tabs.Tab value="seguridad">🔒 Seguridad</Tabs.Tab>
        <Tabs.Tab value="facturacion">💳 Facturación</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="perfil">Nombre, foto y biografía.</Tabs.Panel>
      <Tabs.Panel value="seguridad">Contraseña y autenticación en dos pasos.</Tabs.Panel>
      <Tabs.Panel value="facturacion">Plan actual: Pro · próxima factura el día 1.</Tabs.Panel>
    </Tabs>
  );
}
