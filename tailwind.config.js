module.exports = {
  mode: 'jit',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './styled/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        backgroundDark: 'rgb(15, 15, 36)',
        background: 'rgb(26, 26, 64)',
        primary: 'hsl(325, 94%, 66%)',
        primaryLight: 'hsl(325, 94%, 76%)',
        secondary: 'rgb(122, 11, 192)',
      },
    },
  },
  plugins: [],
};
