import { createContext, useContext, useState } from 'react';

// Problema: pasar "user" por 3 niveles de componentes que no lo usan (prop drilling).
// Solución: Context. El Provider lo ofrece y cualquier descendiente lo lee con useContext.

interface User {
  name: string;
}

const UserContext = createContext<User>({ name: 'Invitado' }); // valor por defecto tipado

function Avatar() {
  const user = useContext(UserContext); // lo lee directamente, sin props
  return (
    <span className="grid size-9 place-items-center rounded-full bg-violet-500 font-bold text-white">
      {user.name[0]}
    </span>
  );
}

function Header() {
  return (
    <header className="flex items-center justify-between rounded-lg bg-zinc-800 p-3">
      <span className="font-semibold text-white">Mi app</span>
      <Avatar />
    </header>
  );
}

function Layout() {
  return (
    <div className="space-y-2">
      <Header />
      <p className="text-sm text-zinc-500">Layout y Header no reciben ni pasan "user" 👆</p>
    </div>
  );
}

export default function PropDrilling() {
  const [user, setUser] = useState<User>({ name: 'Sofía' });

  return (
    // En React 19 el contexto se usa directamente como Provider
    <UserContext value={user}>
      <div className="max-w-sm space-y-3">
        <input
          value={user.name}
          onChange={(event) => setUser({ name: event.target.value || '?' })}
          className="w-full rounded-lg bg-zinc-800 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-sky-500"
        />
        <Layout />
      </div>
    </UserContext>
  );
}
