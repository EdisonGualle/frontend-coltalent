/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      container: {
        screens: {
          xl: '1200px',
        },
      },
      colors: {
        success: 'hsl(var(--success))',
        warning: 'hsl(var(--warning))',
        info: 'hsl(var(--info))',
        danger: 'hsl(var(--danger))',
        primary: "#ecd006",
        secondary: {
          '50': '#ebf7ff',
          '100': '#d1eeff',
          '200': '#aee2ff',
          '300': '#76d3ff',
          '400': '#35b9ff',
          '500': '#0792ff',
          '600': '#006cff',
          '700': '#0053ff',
          '800': '#0044d7',
          '900': '#0046ba',
          '950': '#062765',
        },
        border: 'hsl(var(--border))',
        foreground: 'hsl(var(--foreground))',
        background: {
          DEFAULT: 'hsl(var(--background))',
          secondary: 'hsl(var(--background-secondary))',
          tertiary: 'hsl(var(--background-tertiary))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        verde: '#ffff89',
      },
      transitionDuration: {
        DEFAULT: '150ms',
      },
      boxShadow: {
        '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
      },
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',
        DEFAULT: '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        'full': '9999px',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'scale(.95)' }
        },
        fadeOut: {
          to: { opacity: '0', transform: 'scale(.95)' }
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.1s ease-out',
        fadeOut: 'fadeOut 0.15s ease-out forwards',
      },
    },
  },
  important: true,
  plugins: [require('@headlessui/tailwindcss')],
};