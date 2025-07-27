/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html", // For index.html
    "./src/**/*.{js,jsx,ts,tsx}", // For all JS/JSX/TS/TSX files in src/
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#5a67d8', // Softer indigo for primary
          light: '#7f9cf5',
          dark: '#434190',
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#5a67d8',
          600: '#4c51bf',
          700: '#434190',
          800: '#3730a3',
          900: '#312e81',
        },
        accent: {
          DEFAULT: '#ed64a6', // Vibrant pink for accent
          light: '#f687b3',
          dark: '#db2777',
          50: '#fff1f2',
          100: '#fce4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#f472b6',
          500: '#ed64a6',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
        secondary: {
          DEFAULT: '#38bdf8', // Bright cyan for secondary
          light: '#7dd3fc',
          dark: '#0ea5e9',
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        glass: {
          white: 'rgba(255, 255, 255, 0.2)',
          dark: 'rgba(0, 0, 0, 0.2)',
          primary: 'rgba(90, 103, 216, 0.2)',
          accent: 'rgba(237, 100, 166, 0.2)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'float': 'float 5s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 10s ease infinite',
        'slide-in': 'slide-in 0.5s ease-out forwards',
        'bounce-in': 'bounce-in 0.7s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards',
        'fade-in': 'fadeIn 0.4s ease-in-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
        'shimmer': 'shimmer 1.5s linear infinite',
        'rotate-in': 'rotateIn 0.5s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-15px) rotate(180deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 15px rgba(90, 103, 216, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(90, 103, 216, 0.5)' },
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'slide-in': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'bounce-in': {
          '0%': { opacity: '0', transform: 'scale(0.5) translateY(40px)' },
          '50%': { opacity: '1', transform: 'scale(1.1)' },
          '70%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1) translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        rotateIn: {
          '0%': { transform: 'rotate(-10deg) scale(0.9)', opacity: '0' },
          '100%': { transform: 'rotate(0deg) scale(1)', opacity: '1' },
        },
      },
      boxShadow: {
        'glass': '0 4px 20px rgba(0, 0, 0, 0.15)',
        'glass-inset': 'inset 0 -1px 0 rgba(255, 255, 255, 0.1)',
        'glow': '0 0 15px rgba(90, 103, 216, 0.3)',
        'glow-lg': '0 0 25px rgba(90, 103, 216, 0.4)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.12)',
        'inner-glow': 'inset 0 1px 3px rgba(255, 255, 255, 0.15)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, var(--tw-colors-primary-500) 0%, var(--tw-colors-primary-700) 100%)',
        'gradient-accent': 'linear-gradient(135deg, var(--tw-colors-accent-500) 0%, var(--tw-colors-accent-700) 100%)',
        'gradient-secondary': 'linear-gradient(135deg, var(--tw-colors-secondary-500) 0%, var(--tw-colors-secondary-700) 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
        'shimmer': 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
      },
      backdropBlur: {
        xs: '2px',
        '4xl': '60px',
      },
      borderRadius: {
        '4xl': '1.5rem',
        '5xl': '2rem',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
        '6xl': ['3.75rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        '7xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        '8xl': ['6rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        '9xl': ['8rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
      },
      lineHeight: {
        '11': '2.75rem',
        '12': '3rem',
        '13': '3.25rem',
        '14': '3.5rem',
      },
    },
  },
  plugins: [
    function ({ addUtilities, theme }) {
      const newUtilities = {
        '.glass': {
          backgroundColor: theme('colors.glass.white'),
          backdropFilter: 'blur(12px)',
          '-webkit-backdrop-filter': 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          boxShadow: theme('boxShadow.glass'),
        },
        '.glass-dark': {
          backgroundColor: theme('colors.glass.dark'),
          backdropFilter: 'blur(12px)',
          '-webkit-backdrop-filter': 'blur(12px)',
          border: '1px solid rgba(0, 0, 0, 0.25)',
          boxShadow: theme('boxShadow.glass'),
        },
        '.glass-card': {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(15px)',
          '-webkit-backdrop-filter': 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: theme('boxShadow.card'),
        },
        '.text-gradient': {
          background: theme('backgroundImage.gradient-primary'),
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.border-gradient': {
          border: '2px solid transparent',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
          backgroundImage: `linear-gradient(white, white) padding-box, ${theme('backgroundImage.gradient-primary')} border-box`,
        },
        '.header-glass': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          '-webkit-backdrop-filter': 'blur(10px)',
        },
        '.btn-primary': {
          backgroundColor: theme('colors.primary.DEFAULT'),
          color: theme('colors.white'),
          '&:hover': {
            backgroundColor: theme('colors.primary.dark'),
            boxShadow: theme('boxShadow.glow'),
          },
          '&:focus': {
            ringColor: theme('colors.primary.light'),
          },
        },
        '.btn-accent': {
          backgroundColor: theme('colors.accent.DEFAULT'),
          color: theme('colors.white'),
          '&:hover': {
            backgroundColor: theme('colors.accent.dark'),
            boxShadow: theme('boxShadow.glow'),
          },
          '&:focus': {
            ringColor: theme('colors.accent.light'),
          },
        },
        '.btn-shimmer': {
          position: 'relative',
          overflow: 'hidden',
          zIndex: 1,
        },
        '.btn-shimmer::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: theme('backgroundImage.shimmer'),
          transition: 'left 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: -1,
        },
        '.btn-shimmer:hover::before': {
          left: '100%',
        },
        '.loading-glow': {
          boxShadow: `0 0 12px ${theme('colors.primary.light')}, 0 0 24px ${theme('colors.primary.DEFAULT')}`,
        },
        '.input-glass': {
          background: 'rgba(255, 255, 255, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)',
        },
        '.form-glass': {
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          '-webkit-backdrop-filter': 'blur(20px)',
        },
      };
      addUtilities(newUtilities);
    },
  ],
};