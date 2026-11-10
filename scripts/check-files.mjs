// Static packaging check; it does NOT replace a TypeScript build or runtime tests.
import fs from "node:fs";
const required = [
  "app/page.tsx", "app/layout.tsx", "app/category/[slug]/page.tsx",
  "app/product/[slug]/page.tsx", "app/signin/page.tsx", "app/signup/page.tsx",
  "app/profile/page.tsx", "app/profile/edit/page.tsx", "app/not-found.tsx",
  "app/api/auth/[...all]/route.ts", "app/api/auth/providers/route.ts", "app/api/bazardor/[...path]/route.ts",
  "lib/auth.ts", "lib/auth-client.ts", "lib/products.ts", "public/bazar-hero.png",
  "README.md", ".env.example", "AUTH_WALKTHROUGH_BN.md", "START_BAZARDOR.cmd", "SETUP_WINDOWS.ps1"
];
let failures = 0;
for (const file of required) {
  if (!fs.existsSync(file)) { console.error("MISSING:", file); failures++; }
}
console.log(failures ? `${failures} required files are missing.` : `Packaging OK: ${required.length} files found. Build and runtime tests still required.`);
process.exitCode = failures ? 1 : 0;
