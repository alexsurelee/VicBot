module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"]
  },
  overrides: [
    {
      files: "*",
      rules: {
      "global-require": 0
    }}
  ],
  extends: [
    "airbnb-typescript",
    "prettier/@typescript-eslint",
    "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ]
};
