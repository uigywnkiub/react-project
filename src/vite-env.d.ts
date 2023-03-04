/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USERNAME_KEY: string
  readonly VITE_PASSWORD_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
