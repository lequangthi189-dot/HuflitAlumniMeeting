/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0b1020',
        panel: '#141a2e',
        panel2: '#1b2240',
        border: '#2a3358',
        muted: '#8a93b2',
        text: '#e6e9f5',
        accent: '#7c9cff',
        accent2: '#5eead4'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
}
