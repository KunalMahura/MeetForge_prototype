/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        /* Old palette kept for InterviewRoom compatibility */
        'theme-red': '#BF1A1A',
        'theme-orange': '#FF6C0C',
        'theme-yellow': '#FFE08F',
        'theme-navy': '#060771',
        /* New light palette */
        'surface': '#FAFAF8',
        'surface-raised': '#FFFFFF',
        'surface-muted': '#F3F3EF',
        'ink': '#18181B',
        'ink-muted': '#71717A',
        'ink-faint': '#A1A1AA',
        'accent-green': '#5E8056',
        'accent-olive': '#6B7B5E',
        'accent-orange': '#E8913A',
        'accent-peach': '#F0C9A0',
        'accent-purple': '#8A98DF',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 3s infinite',
        'slide-up': 'slideUp 0.6s ease-out',
        'fade-in': 'fadeIn 0.8s ease-out',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
