import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  const isLibrary = mode === 'library';

  return {
    plugins: [react()],
    build: isLibrary ? {
      lib: {
        entry: path.resolve(__dirname, 'src/index.js'),
        name: 'ReactSynthPlus',
        fileName: (format) => `react-synth-plus.${format}.js`,
      },
      rollupOptions: {
        external: ['react', 'react-dom', 'tone'],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            tone: 'Tone',
          },
        },
      },
    } : {
      // Default app build (for showcase/app)
      outDir: 'dist-app',
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.js',
    },
  }
})
