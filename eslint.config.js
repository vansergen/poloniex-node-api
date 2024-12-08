import config from "eslint-config-binden-ts";
export default [
  ...config,
  { ignores: ["dist/*", "docs/*"] },
  {
    rules: {
      "@typescript-eslint/prefer-promise-reject-errors": "warn",
      "sort-imports": "warn",
    },
  },
  { languageOptions: { parserOptions: { project: "tsconfig.json" } } },
];
