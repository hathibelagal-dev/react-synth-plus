import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig(({ mode }) => {
  const isLibrary = mode === 'library';

  return {
    plugins: [react()],
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode === 'library' ? 'production' : 'development'),
    },
    build: isLibrary ? {
      lib: {
        entry: path.resolve(__dirname, 'src/index.js'),
        name: 'ReactSynthPlus',
        fileName: (format) => `react-synth-plus.${format}.js`,
      },
      rollupOptions: {
        external: ['react', 'react-dom', 'tone', 'react/jsx-runtime'],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            tone: 'Tone',
            'react/jsx-runtime': 'jsxRuntime',
          },
        },
      },
    } : {
      outDir: 'dist-app',
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.js',
    },
  }
})
