/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // Add more variables here as you add them to .env
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}