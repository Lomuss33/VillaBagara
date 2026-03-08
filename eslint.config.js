import js from "@eslint/js"
import globals from "globals"
import reactPlugin from "eslint-plugin-react"
import reactRefresh from "eslint-plugin-react-refresh"

export default [
    {
        ignores: ["dist/**", "build/**", "node_modules/**"],
    },
    {
        files: ["**/*.{js,jsx}"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        settings: {
            react: {
                version: "detect",
            },
        },
        plugins: {
            react: reactPlugin,
            "react-refresh": reactRefresh,
        },
        rules: {
            ...js.configs.recommended.rules,
            ...reactPlugin.configs.recommended.rules,
            "no-unused-vars": "off",
            "react/no-unescaped-entities": "off",
            "react/prop-types": "off",
            "react/react-in-jsx-scope": "off",
            "react-refresh/only-export-components": "off",
        },
    },
]
