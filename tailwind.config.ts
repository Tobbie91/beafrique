import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0F9D58', 
          dark: '#0B8043',
          light: '#34A853',
        },
        // Accent = YELLOW
        accent: {
          DEFAULT: '#F6C915',
          dark: '#EAAA00',
          light: '#FFE14D',
        },
      },
      boxShadow: {
        soft: '0 6px 24px rgba(0,0,0,.08)'
      },
      borderRadius: {
        '2xl': '1rem'
      }
    },
  },
  plugins: [],
} satisfies Config
