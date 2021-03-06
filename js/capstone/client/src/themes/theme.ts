import theme from 'styled-theming';
import { useState, useEffect } from 'react';

// Used to genereate media query min-width rules
export const mediaQueryFactory = (minWidth: number): string => `@media (min-width: ${minWidth}em)`;

export const mediaQueryString = (minWidth: number): string => `(min-width: ${minWidth}em)`;

// The media query break points for tablet (48em/768px) and desktop (64em/1024px)
export const media = {
    tablet: mediaQueryFactory(48),
    desktop: mediaQueryFactory(64),
};

export const queryString = {
    tablet: mediaQueryString(48),
    desktop: mediaQueryString(64),
} as const;

export const useMediaQueryString = (cond: keyof typeof queryString): boolean => {
    const query = window.matchMedia(queryString[cond]);
    const [match, setMatch] = useState(query.matches);
    useEffect(() => {
        const handleMatch = (q: MediaQueryListEvent): void => setMatch(q.matches);
        query.addListener(handleMatch);
        return () => query.removeListener(handleMatch);
    });
    return match;
};

// The primary color of the app representing "TEAM YELLOW"
export const primaryColor = '#F6EC15';

// The accent color which should be used sparingly
export const accentColor = '#5141B2';

// This should be used for the background color on the bigger surfaces like the body
export const backgroundColor = theme('mode', {
    light: '#fff',
    dark: '#303030',
});

// Should be used to highlight stuff against the primaryColor as the background
export const primaryTextColor = theme('mode', {
    light: '#48483C',
    dark: '#fff',
});

export const textColor = theme('mode', {
    light: '#48483C',
    dark: '#fff',
});

export const bodyColor = theme('mode', {
    light: '#f9f9f9',
    dark: '#303030',
});

// Should be used for less important stuff against the primaryColor like inactive
// links on the sidebar
export const secondaryTextColor = theme('mode', {
    light: '#6D6C5F',
    dark: '#C3C3C3',
});

export type themes = 'light' | 'dark';

export type BaseVariant = 'primary' | 'secondary';

export const dayColors = {
    darkGrey: '#48483C',
    lighterDarkGrey: '#6D6C5F',
    grey: '#F3F3F1',
    white: '#FFF',
    lighterPrimary: '#FFF96F',
};

export const nightColors = {
    backgroundDark: '#212121',
    backgroundGrey: '#303030',
    backgroundGreyLighter: '#6C6C6C',
    cardGrey: '#424242',
    white: '#FFF',
    grey: '#C3C3C3',
};
