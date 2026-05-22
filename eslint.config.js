import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import config from "@binden/eslint-config-ts";

export default [
  ...config,
  { ignores: ["dist/*", "docs/*", "coverage/*"] },
  {
    rules: {
      "@typescript-eslint/prefer-promise-reject-errors": "warn",
      "sort-imports": "off",
    },
  },
  {
    languageOptions: {
      parserOptions: {
        project: "tsconfig.json",
        tsconfigRootDir: dirname(fileURLToPath(import.meta.url)),
      },
    },
  },
];
