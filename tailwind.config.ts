import type { Config } from 'tailwindcss';
const daisyui = require('daisyui');

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/react-tailwindcss-datepicker/dist/index.esm.js'
  ],
  daisyui: {
    themes: [
      {
        business: {
          ...require('daisyui/src/theming/themes')['business'],
          primary: '#2e6c7b'
        }
      }
    ],
    logs: false,
    prefix: ''
  },
  plugins: [daisyui]
} satisfies Config;
