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
        snow: {
          ink: '#1C1C1C',
          muted: 'rgba(28, 28, 28, 0.4)',
          surface: '#F9F9FA',
          card: '#FFFFFF',
          lavender: '#EDEEFC',
          sky: '#E6F1FD',
          blue: '#007AFF',
          skyAccent: '#4C98FD',
          mint: '#71DD8C',
          teal: '#6BE6D3',
          amber: '#FFCC00',
          red: '#FF3B30',
        },
        luxury: {
          dark: '#1C1C1C',
          navy: '#2C2C2E',
          emerald: '#71DD8C',
          accent: '#007AFF',
          rose: '#FF3B30',
          canvas: '#F9F9FA',
        },
        state: {
          success: '#71DD8C',
          warning: '#FFCC00',
          danger: '#FF3B30',
          nevea: '#007AFF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
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
