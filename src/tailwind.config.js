// eslint-disable-next-line @typescript-eslint/no-var-requires
const { colors } = require('tailwindcss/defaultTheme');

module.exports = {
    theme: {
        extend: {
            backgroundColor: () => ({
                dark: {
                    0: '#121212',
                    2: '#262626',
                    4: '#2a2a2a',
                    8: '#313131',
                    16: '#383838',
                    24: '#3b3b3b',
                },
            }),
        },
        colors: {
            primary: colors.yellow,
            gray: colors.gray,
            white: colors.white,
            transparent: colors.transparent,
            red: colors.red,
            blue: colors.blue,
        },
    },
    variants: {},
    plugins: [],
};
