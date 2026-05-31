interface ImportMetaEnv {
  readonly BACKEND_URL: string
  // Add other variables here...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}