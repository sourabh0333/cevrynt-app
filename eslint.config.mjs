import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Pages, components and the shared modules read data only through the data
// layer's getters and views (lib/data/*.ts, lib/data/views). The records
// themselves (lib/data/sample), the backend calls (lib/data/api) and the
// switch between them (lib/data/source) stay private to lib/data.
const dataLayerOnly = {
  patterns: [
    {
      group: ["@/lib/data/sample", "@/lib/data/sample/*", "@/lib/data/api", "@/lib/data/api/*", "@/lib/data/source", "**/data/sample", "**/data/sample/*", "**/data/api", "**/data/api/*"],
      message: "Read data through the data layer (lib/data getters or lib/data/views), not its sources.",
    },
    {
      group: ["@/lib/sample-data", "@/lib/sample-data/*"],
      message: "lib/sample-data is gone: records live in lib/data/sample (read through lib/data), wording in lib/copy.",
    },
  ],
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["**/*.{ts,tsx,js,jsx,mjs}"],
    ignores: ["lib/data/**"],
    rules: { "no-restricted-imports": ["error", dataLayerOnly] },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
