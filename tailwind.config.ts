import type { Config } from 'tailwindcss';

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    // "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js"
  ],
      daisyui: {
        themes: ["business"],
        logs: false,
      },
  plugins: [require('daisyui'), require('@headlessui/react')],
} satisfies Config;
