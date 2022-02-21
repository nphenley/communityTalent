module.exports = {
  mode: 'jit',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './_components/**/*.{js,ts,jsx,tsx}',
    './_styled/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        backgroundDarker: 'hsl(240, 41%, 5%)',
        backgroundDark: 'hsl(240, 41%, 10%)',
        background: 'hsl(240, 41%, 16%)',
        backgroundLight: 'hsl(240, 41%, 55%)',

        primaryDark: 'hsl(325, 94%, 16%)',
        primary: 'hsl(325, 94%, 66%)',
        primaryLight: 'hsl(325, 94%, 76%)',
        secondary: 'rgb(122, 11, 192)',
      },
    },
  },
  plugins: [],
};
