import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './setupTests.js',
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'], 
      exclude: [
        'node_modules/',
        'src/main.jsx',
        'src/App.jsx', 
        '**/*.constant.jsx', // Não testamos constantes
        '**/*.mock.js',
        '**/*.test.{js,jsx}', // Não faz sentido o teste testar o próprio teste
      ],
    },
  },
})
