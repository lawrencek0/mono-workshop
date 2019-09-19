import theme from 'styled-theming';
import { primaryColor, dayColors, nightColors } from 'theme';
import { css } from 'styled-components';

export const sidebarBackgroundColor = theme.variants('mode', 'variant', {
    primary: { light: primaryColor, dark: nightColors.backgroundDark },
    secondary: { light: dayColors.grey, dark: nightColors.backgroundDark },
});

export const sidebarColor = theme('mode', {
    light: dayColors.lighterDarkGrey,
    dark: nightColors.grey,
});

export const navItemStyles = theme.variants('mode', 'variant', {
    primary: {
        light: css`
            background-color: transparent;
            color: ${dayColors.darkGrey};

            &:hover {
                background-color: ${dayColors.lighterPrimary};
            }
        `,
        dark: css`
            background-color: transparent;
            color: ${nightColors.grey};

            &:hover {
                background-color: ${nightColors.backgroundGreyLighter};
            }
        `,
    },
    secondary: {
        light: css`
            background-color: transparent;
            color: ${dayColors.darkGrey};

            &:hover {
                background-color: ${dayColors.white};
            }
        `,
        dark: css`
            background-color: transparent;
            color: ${nightColors.grey};

            &:hover {
                background-color: ${nightColors.backgroundGreyLighter};
            }
        `,
    },
    active: {
        light: css`
            background-color: ${dayColors.lighterPrimary};
            color: ${dayColors.darkGrey};
        `,
        dark: css`
            background-color: ${nightColors.backgroundGreyLighter};
            color: ${nightColors.white};
        `,
    },
});

export * from 'theme';
