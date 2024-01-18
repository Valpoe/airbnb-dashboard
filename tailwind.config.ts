import type { Config } from 'tailwindcss';
const daisyui = require('daisyui');
// const typography = require('@tailwindcss/typography');
const headlessui = require('@headlessui/react');

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    // "./src/**/*.{js,jsx,ts,tsx}",
    './node_modules/react-tailwindcss-datepicker/dist/index.esm.js'
  ],

  // theme: {
  //   extend: {
  //     fontFamily: {
  //       sans: ['Nunito Sans Variable', 'sans-serif']
  //     }
  //   }
  // },

  daisyui: {
    themes: ['business'],
    logs: false,
    prefix: ''
  },
  plugins: [daisyui, headlessui]
} satisfies Config;
