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
        darkbg: {
          900: '#06080F', // deep cosmic black
          800: '#0B0F19', // very dark blue-gray
          700: '#121826', // card background
          600: '#1B2336', // lighter border/input
        },
        cricket: {
          neon: '#a3e635', // lime neon
          cyan: '#00f0ff', // cyan neon
          orange: '#f97316', // orange accent
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s infinite alternate',
        'bounce-slow': 'bounce 3s infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        pulseGlow: {
          '0%': { boxShadow: '0 0 10px rgba(163, 230, 53, 0.2), 0 0 20px rgba(163, 230, 53, 0.1)' },
          '100%': { boxShadow: '0 0 20px rgba(163, 230, 53, 0.6), 0 0 35px rgba(163, 230, 53, 0.3)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
