import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 6,
      sourceType: "module",
      globals: {
        ...globals.node
      }
    },
    rules: {
      "no-var": "error",
      "semi": ["error", "always"]
    }
  }
];
