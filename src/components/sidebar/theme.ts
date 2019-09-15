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
        `,
        dark: css`
            background-color: transparent;
            color: ${nightColors.grey};
        `,
    },
    secondary: {
        light: css`
            background-color: transparent;
            color: ${dayColors.grey};
        `,
        dark: css`
            background-color: transparent;
            color: ${nightColors.grey};
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
