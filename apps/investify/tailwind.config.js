/** @type {import('tailwindcss').Config} */
const { join } = require('path');
const { createGlobPatternsForDependencies } = require('@nrwl/next/tailwind');

function withOpacityValue(variable) {
  return ({ opacityValue }) => {
    if (opacityValue === undefined) {
      return `rgb(var(${variable}))`;
    }
    return `rgb(var(${variable}) / ${opacityValue})`;
  };
}

module.exports = {
  content: [
    join(__dirname, './pages/*.{js,ts,jsx,tsx}'),
    join(__dirname, './components/**/*.{js,ts,jsx,tsx}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      fontSize: {
        xs: '.75rem',
      },
      fontFamily: {
        sans: ['Silka'],
      },
      colors: {
        primary: withOpacityValue('--color-primary'),
        secondary: withOpacityValue('--color-secondary'),
        tertiary: withOpacityValue('--color-tertiary'),
        text: withOpacityValue('--color-text'),
        'sub-light': withOpacityValue('--color-sub-light'),
        'sub-dark': withOpacityValue('--color-sub-dark'),
        cards: withOpacityValue('--color-cards'),
        background: withOpacityValue('--color-background'),
        sidebar: withOpacityValue('--color-sidebar'),
        'custom-border': withOpacityValue('--color-custom-border'),
        success: withOpacityValue('--color-success'),
        warning: withOpacityValue('--color-warning'),
        error: withOpacityValue('--color-error'),
        info: withOpacityValue('--color-info'),
        red: withOpacityValue('--color-red'),
      },
      backgroundImage: {
        'gradient-primary': `linear-gradient(90deg, #FFFFFF 0.33%, #F6F7FF 95.86%)`,
        'gradient-overlay': `linear-gradient(
          0deg,
          rgba(11, 120, 221, 0.6) 0%,
          rgba(11, 120, 221, 0.6) 80%,
          rgba(11, 221, 145, 0.6) 100%
        );`,
        'dashboard-card': `url('/credit_card.png')`,
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
  presets: [require('../../tailwind-workspace-preset.js')],
};
