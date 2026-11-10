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
        state: {
          success: '#12B76A',
          warning: '#F79009',
          danger: '#F04438',
          nevea: '#0284C7',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
