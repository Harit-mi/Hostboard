import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".agents/**",
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  ...nextVitals,
  ...nextTs,
  {
    ignores: [
      ".agents/skills/**/*.cjs",
      ".agents/**"
    ]
  },
]);

export default eslintConfig;
