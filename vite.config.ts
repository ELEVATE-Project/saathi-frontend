import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "node:path"
import fs from "node:fs"

const srcDir = path.resolve(process.cwd(), "src")

// CRA resolves bare imports like `import X from "store"` relative to src/
// via tsconfig.json's baseUrl. Vite has no built-in equivalent, so replicate
// it with one alias per top-level src/ entry (directory or file).
const srcRootAliases = Object.fromEntries(
  fs.readdirSync(srcDir).map(entry => [entry.replace(/\.[^.]+$/, ""), path.join(srcDir, entry)])
)

export default defineConfig({
  plugins: [react()],

  // Matches package.json "homepage": "/"
  base: "/",

  // Keep existing REACT_APP_* env var names working without renaming to VITE_*
  envPrefix: "REACT_APP_",

  resolve: {
    alias: srcRootAliases,
  },

  server: {
    port: Number(process.env.PORT) || 3005,
  },

  build: {
    // Keep "build" so server.js, Dockerfile, and nginx.conf don't need path changes
    outDir: "build",
    rollupOptions: {
      input: "index.html",
    },
  },
})
