import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        white: "#FFFFFF",
        lighter_grey: "#FAFAFA",
        "th-background": "var(--background)",
        "th-background-primary": "var(--background-primary)",
        "th-primary-light": "var(--primary-light)",
        "th-primary-medium": "var(--primary-medium)",
        "th-primary-hard": "var(--primary-hard)",
        "th-secondary-light": "var(--secondary-light)",
        "th-secondary-medium": "var(--secondary-medium)",
        "th-secondary-hard": "var(--secondary-hard)",
        "th-grey-light": "var(--grey-light)",
        "th-grey-medium": "var(--grey-medium)",
        "th-grey-hard": "var(--grey-hard)",
        "th-danger-light": "var(--danger-light)",
        "th-danger-medium": "var(--danger-medium)",
        "th-danger-hard": "var(--danger-hard)",
        "th-warning-light": "var(--warning-light)",
        "th-warning-medium": "var(--warning-medium)",
        "th-warning-hard": "var(--warning-hard)",
        "th-info-light": "var(--info-light)",
        "th-info-medium": "var(--info-medium)",
        "th-info-hard": "var(--info-hard)",
        "th-dark-light": "var(--dark-light)",
        "th-dark-medium": "var(--dark-medium)",
        "th-dark-hard": "var(--dark-hard)",
        "th-success-light": "var(--success-light)",
        "th-success-medium": "var(--success-medium)",
        "th-success-hard": "var(--success-hard)",
        "th-zinc-light": "var(--zinc-light)",
        "th-zinc-medium": "var(--zinc-medium)",
        "th-neutral-light": "var(--neutral-light)",
      },
      fontFamily: {
        mono: ["var(--font-roboto)"],
      },
    },
  },
  plugins: [],
};
export default config;
