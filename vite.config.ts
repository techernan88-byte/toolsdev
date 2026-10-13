import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // PGlite (PostgreSQL en WebAssembly) carga sus propios archivos .wasm: Vite no debe pre-empaquetarlo
  optimizeDeps: { exclude: ['@electric-sql/pglite'] },
});
