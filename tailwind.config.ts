import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'ui-sans-serif', 'system-ui'],
        display: ['Fraunces', 'serif']
      },
      colors: {
        bg: '#f5efe5',
        surface: '#fffaf2',
        ink: '#1f1b16',
        brand: {
          50: '#fff3ee',
          100: '#ffe1d3',
          200: '#ffc2a7',
          300: '#ff9a71',
          400: '#ff763f',
          500: '#F15200',
          600: '#d94800',
          700: '#b63d00'
        },
        accent: '#137868'
      },
      boxShadow: {
        premium: '0 12px 40px rgba(69, 27, 0, 0.14)'
      },
      borderRadius: {
        xl2: '1.25rem'
      }
    }
  },
  plugins: []
}

export default config
