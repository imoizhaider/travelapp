/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          950: '#070B1A',
          900: '#0F1729',
          800: '#1A2542',
          700: '#243358'
        },
        accent: {
          blue: '#3B82F6',
          cyan: '#06B6D4',
          gold: '#F59E0B'
        },
        glass: {
          bg: 'rgba(255,255,255,0.04)',
          'bg-hover': 'rgba(255,255,255,0.07)',
          border: 'rgba(255,255,255,0.08)',
          'border-hover': 'rgba(255,255,255,0.14)',
          'bg-nested': 'rgba(255,255,255,0.03)'
        },
        ink: {
          950: '#070B1A',
          900: '#0F1729',
          800: '#1A2542',
          700: '#243358'
        },
        ocean: {
          500: '#3B82F6'
        }
      },
      fontFamily: {
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        soft: '0 20px 50px rgba(2, 6, 23, 0.35)',
        lift: '0 16px 40px rgba(59, 130, 246, 0.16)',
        glow: '0 0 30px rgba(245, 158, 11, 0.12)'
      },
      backgroundImage: {
        hero: 'radial-gradient(circle at top left, rgba(59,130,246,0.18), transparent 34%), radial-gradient(circle at 85% 15%, rgba(255,255,255,0.10), transparent 24%), linear-gradient(135deg, #070B1A 0%, #0F1729 52%, #1A2542 100%)',
        'gold-blue': 'linear-gradient(135deg, #F59E0B 0%, #3B82F6 100%)',
        'blue-cyan': 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)'
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      },
      animation: {
        fadeUp: 'fadeUp 0.5s ease-out both',
        shimmer: 'shimmer 1.6s linear infinite'
      }
    }
  },
  plugins: []
};
