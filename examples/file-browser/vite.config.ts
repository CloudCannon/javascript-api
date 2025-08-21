import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		minify: false, // This disables minification
	},
	plugins: [react()],
	server: {
		port: 3000,
	},
	optimizeDeps: {
		include: ['monaco-editor/esm/vs/language/typescript/typescript.worker'],
	},
});
