import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      'process.env.PINATA_API_KEY': JSON.stringify(env.PINATA_API_KEY),
      'process.env.PINATA_SECRET_API_KEY': JSON.stringify(env.PINATA_SECRET_API_KEY),
      'process.env.BLOCKCHAIN_RPC_URL': JSON.stringify(env.BLOCKCHAIN_RPC_URL),
      'process.env.PRIVATE_KEY': JSON.stringify(env.PRIVATE_KEY),
      'process.env.CONTRACT_ADDRESS': JSON.stringify(env.CONTRACT_ADDRESS),
      'process.env.MONGODB_URI': JSON.stringify(env.MONGODB_URI),
      'process.env.JWT_SECRET': JSON.stringify(env.JWT_SECRET),
      'process.env.PORT': JSON.stringify(env.PORT),
      'process.env.REACT_APP_API_URL': JSON.stringify(env.REACT_APP_API_URL),
      'process.env.ADMIN_ADDRESS': JSON.stringify(env.ADMIN_ADDRESS)
    }
  };
});