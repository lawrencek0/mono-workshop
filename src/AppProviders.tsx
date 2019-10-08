import React, { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { AuthProvider } from 'auth/hooks';
import { themes } from 'theme';
import { EventProvider } from 'calendar/hooks';

const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme] = useState<themes>('light');

    // const toggleTheme = (): void => {
    //     if (theme === 'light') {
    //         setTheme('dark');
    //     } else {
    //         setTheme('light');
    //     }
    // };

    return (
        <ThemeProvider theme={{ mode: theme }}>
            <AuthProvider>
                <EventProvider>{children}</EventProvider>
            </AuthProvider>
        </ThemeProvider>
    );
};

export { AppProviders };
