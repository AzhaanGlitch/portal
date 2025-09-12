import type { Config } from "tailwindcss"

const config: Config = {
    darkMode: "class", // enable dark mode via a class
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                blue: {
                    500: "oklch(0.615 0.076 285.3)",  // from lab(54.1736% 13.3369 -74.6839)
                    600: "oklch(0.505 0.158 287.4)",  // from lab(44.0605% 29.0279 -86.0352)
                },
                gray: {
                    50: "oklch(0.985 0.001 198.4)",  // from lab(98.2596% -0.247031 -0.706708)
                    300: "oklch(0.872 0.006 260.3)",  // from lab(85.1236% -0.612259 -3.7138)
                    400: "oklch(0.672 0.013 262.0)",  // from lab(65.9269% -0.832707 -8.17473)
                    500: "oklch(0.481 0.008 267.8)",  // from lab(47.7841% -0.393182 -10.0268)
                    700: "oklch(0.279 0.013 277.6)",  // from lab(27.1134% -0.956401 -12.3224)
                    800: "oklch(0.167 0.015 276.5)",  // from lab(16.1051% -1.18239 -11.7533)
                    850: "oklch(0.125 0.0145 289.6)",  // from lab(12.1132% 0.004769 -12.3534)
                    900: "oklch(0.083 0.014 302.6)",  // from lab(8.11897% 0.811279 -12.254)
                },
            },
        }


    },
    plugins: [],
}
export default config
