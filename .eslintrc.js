module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "airbnb-base",
    "next/core-web-vitals"
  ],
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
    project: './tsconfig.json'
  },
  rules: {
    "jsx-quotes": ["error", "prefer-double"],
    "react/jsx-max-props-per-line": ["error", { maximum: 2 }],
    "max-len": ["error", { code: 120 }],
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "react/jsx-filename-extension": ["error", { extensions: [".ts", ".tsx"] }],
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ],
    "import/no-unresolved": "off",
    "react/jsx-props-no-spreading": [
      1,
      {
        html: "enforce",
        custom: "ignore",
      },
    ]
  },
  settings: {
    react: {
      version: "detect", // Tells eslint-plugin-react to automatically detect the version of React to use
    },
  },
};
