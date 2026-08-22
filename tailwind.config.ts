import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "rgb(var(--c-primary) / <alpha-value>)",
                secondary: "rgb(var(--c-secondary) / <alpha-value>)",
                tertiary: "rgb(var(--c-tertiary) / <alpha-value>)",
                accent: {
                    DEFAULT: "rgb(var(--c-accent) / <alpha-value>)",
                    hover: "rgb(var(--c-accent) / 0.9)"
                },
                hairline: "rgb(var(--c-hairline))",
                "hairline-strong": "rgb(var(--c-hairline-strong))",
            },
        },
        screens: {
            sm: '640px',
            md: '768px',
            lg: '960px',
            xl: '1200px',
            "2xl": "1560px",
            "3xl": "1800px"
        },
        fontFamily: {
            primary: "var(--font-jetbrains)",  
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
};
export default config;
