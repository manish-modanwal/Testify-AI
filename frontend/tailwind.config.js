/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'snake-line': {
          '0%': { transform: 'scaleX(0) skewX(20deg)' },
          '50%': { transform: 'scaleX(1) skewX(-20deg)' },
          '100%': { transform: 'scaleX(1) skewX(0deg)' },
        },
        'typing': {
          'from': { width: '0' },
          'to': { width: '100%' },
        },
        'blink-caret': {
          'from, to': { 'border-color': 'transparent' },
          '50%': { 'border-color': 'white' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out both',
        'fade-in-delay-100': 'fade-in 0.6s ease-out 0.1s both',
        'fade-in-delay-200': 'fade-in 0.6s ease-out 0.2s both',
        'pop-in': 'pop-in 0.5s ease-out both',
        'pop-in-delay-200': 'pop-in 0.5s ease-out 0.2s both',
        'pop-in-delay-400': 'pop-in 0.5s ease-out 0.4s both',
        'pop-in-delay-600': 'pop-in 0.5s ease-out 0.6s both',
        'snake-line': 'snake-line 3s ease-in-out forwards',
        'blink': 'blink-caret 0.75s step-end infinite',
      },
    },
  },
  plugins: [],
};