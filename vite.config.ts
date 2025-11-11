import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Exporta configuração com acesso às variáveis .env
export default defineConfig(({ mode }) => {
  // Carrega as variáveis do ambiente atual
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      'process.env': env, // Garante acesso às VITE_FIREBASE_... durante o build
    },
  };
});
