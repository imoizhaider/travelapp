/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#050816',
          900: '#081120',
          800: '#10203d',
          700: '#1a2e52'
        },
        ocean: {
          500: '#2d7ff9',
          600: '#1d63e8'
        },
        sand: {
          50: '#f8f5ef',
          100: '#efe9dd',
          200: '#e0d6c0'
        }
      },
      boxShadow: {
        soft: '0 20px 50px rgba(2, 6, 23, 0.35)',
        lift: '0 16px 40px rgba(29, 99, 232, 0.16)'
      },
      backgroundImage: {
        hero: 'radial-gradient(circle at top left, rgba(45,127,249,0.22), transparent 34%), radial-gradient(circle at 85% 15%, rgba(255,255,255,0.12), transparent 24%), linear-gradient(135deg, #050816 0%, #081120 52%, #10203d 100%)'
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      },
      animation: {
        fadeUp: 'fadeUp 0.6s ease-out both',
        shimmer: 'shimmer 1.6s linear infinite'
      }
    }
  },
  plugins: []
};
