/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        teal: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          500: '#14B8A6',
          600: '#0D9488'
        },
        amber: {
          50: '#FFFBEB',
          500: '#F59E0B',
          600: '#D97706'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 10px 30px rgba(0,0,0,0.08), 0 4px 8px rgba(0,0,0,0.04)',
        modal: '0 20px 60px rgba(0,0,0,0.12)',
        nav: '0 1px 3px rgba(0,0,0,0.04)'
      },
      backgroundImage: {
        hero: 'linear-gradient(135deg, #0D9488 0%, #14B8A6 100%)',
        'teal-cyan': 'linear-gradient(135deg, #0D9488 0%, #14B8A6 100%)',
        'amber-teal': 'linear-gradient(135deg, #F59E0B 0%, #0D9488 100%)'
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
