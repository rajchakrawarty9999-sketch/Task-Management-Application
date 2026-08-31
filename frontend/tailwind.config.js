/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#07080a',
        canvas: '#07080a',
        card: {
          DEFAULT: '#0d0f15',
          hover: '#12151f',
          dark: '#090a0f',
        },
        gold: {
          50: '#fdf9ee',
          100: '#faefd3',
          200: '#f4dfa7',
          300: '#edd295',
          400: '#e5be65',
          500: '#caa457',
          600: '#b0883b',
          700: '#8c6628',
          800: '#6d4d20',
          900: '#4a3313',
          DEFAULT: '#caa457',
          light: '#edd295',
          dark: '#9e7b2d',
          accent: '#e8c77e',
        },
        border: {
          subtle: 'rgba(255, 255, 255, 0.06)',
          gold: 'rgba(202, 164, 87, 0.28)',
          'gold-strong': 'rgba(202, 164, 87, 0.45)',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'gold-glow': '0 0 20px rgba(202, 164, 87, 0.15)',
        'gold-button': '0 2px 14px rgba(202, 164, 87, 0.28), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
        'card-dark': '0 4px 20px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.04)',
      },
      backgroundImage: {
        'gold-metallic': 'linear-gradient(135deg, #f2d38e 0%, #caa457 50%, #9e782f 100%)',
        'gold-btn': 'linear-gradient(180deg, #ebd090 0%, #caa457 50%, #b38b36 100%)',
        'gold-active': 'linear-gradient(90deg, rgba(202, 164, 87, 0.18) 0%, rgba(202, 164, 87, 0.04) 100%)',
      }
    },
  },
  plugins: [],
}
