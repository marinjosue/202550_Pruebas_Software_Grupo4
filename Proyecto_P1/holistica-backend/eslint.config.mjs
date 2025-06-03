import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";


export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    rules: {
      "no-console": ["error", { allow: ["warn", "error"] }],
      "camelcase": ["error", { properties: "always" }],
      //uso obligatorio de comillas y de punto y coma
      "quotes": ["error", "single"],
      "semi": ["error", "always"],
    }
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "commonjs"
    }
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: { globals: globals.node }
  },

  {
    // Configuración específica para archivos de test
    files: ['tests/**/*.js'], // Aplica esta configuración a todos los archivos dentro de la carpeta 'tests'
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },

]);
