import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin-js";
import globals from "globals";

export default [
  js.configs.recommended,

  {
    files: ["**/*.{js,mjs,cjs}"],

    languageOptions: {
      sourceType: "commonjs",
      globals: globals.browser,
    },

    plugins: {
      "@stylistic/js": stylistic,
    },

    rules: {
      "@stylistic/js/indent": ["error", 2],
      "@stylistic/js/linebreak-style": ["error", "unix"],
      "@stylistic/js/quotes": ["error", "single"],
      "@stylistic/js/semi": ["error", "never"],
      "no-undef": "off",
      "no-unused-vars": "off",
      "@stylistic/js/quotes": "off",
      "@stylistic/js/semi": "off",
      "@stylistic/js/linebreak-style": "off",
    },
  },
];
