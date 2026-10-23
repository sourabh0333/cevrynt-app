/**
 * Lets `npm test` (Node's own test runner with type stripping) load the same
 * modules the app does:
 * - "@/..." imports resolve from the project root, like tsconfig "paths";
 *   a missing extension tries ".ts" and then "/index.ts".
 * - Relative imports without an extension ("./source") get the same
 *   treatment, as the bundler does.
 * The test script also runs with `--conditions=react-server`, so the
 * "server-only" marker in lib/data resolves to its empty build, as it does
 * in Server Components.
 */
import { existsSync, statSync } from "node:fs";
import { registerHooks } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = new URL("../", import.meta.url);
const isFile = (p) => existsSync(p) && statSync(p).isFile();

const withTs = (base) => [base, `${base}.ts`, `${base}/index.ts`].find(isFile);

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("@/")) {
      const hit = withTs(fileURLToPath(new URL(specifier.slice(2), root)));
      if (hit) return nextResolve(pathToFileURL(hit).href, context);
    }
    // "./source" from a .ts file: add the extension the bundler would.
    if ((specifier.startsWith("./") || specifier.startsWith("../")) && context.parentURL?.endsWith(".ts")) {
      const hit = withTs(fileURLToPath(new URL(specifier, context.parentURL)));
      if (hit) return nextResolve(pathToFileURL(hit).href, context);
    }
    return nextResolve(specifier, context);
  },
});
