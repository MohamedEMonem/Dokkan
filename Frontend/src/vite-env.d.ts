/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_CLIENT_DEV_BASE_URL: string;
  readonly VITE_CLIENT_PORT: string;
  readonly VITE_SERVER_DEV_API_URL: string;
  readonly VITE_SERVER_PORT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
