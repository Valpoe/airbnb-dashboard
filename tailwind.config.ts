import type { Config } from 'tailwindcss';
const daisyui = require('daisyui');
const headlessui = require('@headlessui/react');

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/react-tailwindcss-datepicker/dist/index.esm.js'
  ],
  daisyui: {
    themes: ['business'],
    logs: false,
    prefix: ''
  },
  plugins: [daisyui, headlessui]
} satisfies Config;
