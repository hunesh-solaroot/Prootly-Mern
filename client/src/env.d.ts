interface ImportMetaEnv {
  readonly VITE_GOOGLE_MAPS_API_KEY: string;
  // ...agar VITE_API_URL bhi hai to wo bhi yaha hoga
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
