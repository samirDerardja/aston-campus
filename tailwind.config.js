/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./frontend/index.html",
    "./frontend/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          midnight: '#101828',
          indigo: '#635BFF',
          violet: '#8B5CF6',
          canvas: '#F8FAFC',
          card: '#FFFFFF',
          secondary: '#667085',
        },
        luxury: {
          dark: '#0F172A',
          navy: '#1E293B',
          emerald: '#00D084',
          accent: '#10B981',
          rose: '#F43F5E',
          canvas: '#F8F9FA',
        },
        state: {
          success: '#12B76A',
          warning: '#F79009',
          danger: '#F04438',
          nevea: '#0284C7',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        '2xs': '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'glass': '0 8px 30px -4px rgba(15, 23, 42, 0.04), 0 2px 6px -1px rgba(15, 23, 42, 0.02), inset 0 1px 2px 0 rgba(255, 255, 255, 0.9)',
      }
    },
  },
  plugins: [],
}
