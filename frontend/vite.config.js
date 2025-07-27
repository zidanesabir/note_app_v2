import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    watch: {
      usePolling: true,
    },
  },
  define: {
    // Correctly expose environment variables for browser context
    // This resolves issues where libraries expect Node.js's `process.env`
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV), // Ensure NODE_ENV is set
    'process.env.DEBUG': JSON.stringify(process.env.DEBUG || ''), // <--- ADD/UPDATE THIS LINE
                                                                // Provide an empty string if DEBUG is not set
  },
});