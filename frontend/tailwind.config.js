import daisyui from 'daisyui'
import forms from '@tailwindcss/forms'

export default {
  darkMode: ['selector', '[data-mode="dark"]'],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    daisyui
  ],
  daisyui: {
    forms,
    themes: ['light', 'dark', 'lofi', 'night', 'cyberpunk', 'winter']
  }
}