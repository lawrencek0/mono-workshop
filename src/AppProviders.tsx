import React, { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { AuthProvider } from 'auth/hooks';
import { themes } from 'theme';

const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<themes>('light');

    const toggleTheme = (): void => {
        if (theme === 'light') {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    };

    return (
        <ThemeProvider theme={{ mode: theme }}>
            <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
    );
};

export { AppProviders };
