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
          900: '#07090e', // deep stadium night black
          800: '#0c0f17', // locker room dark gray
          700: '#141824', // cockpit dashboard cards
          600: '#1f2537', // border and focus states
        },
        cricket: {
          neon: '#10b981', // Premium Turf Emerald Green
          cyan: '#00f0ff', // Hawk-Eye Laser Cyan
          orange: '#ef4444', // Leather Ball Red
          gold: '#f59e0b', // English Willow Gold
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
          '0%': { boxShadow: '0 0 10px rgba(16, 185, 129, 0.2), 0 0 20px rgba(16, 185, 129, 0.1)' },
          '100%': { boxShadow: '0 0 20px rgba(16, 185, 129, 0.6), 0 0 35px rgba(16, 185, 129, 0.3)' },
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
