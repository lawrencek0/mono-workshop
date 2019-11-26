import React, { useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { AuthProvider } from 'auth/hooks';
import { CacheProvider, NetworkManager, SubscriptionManager, PollingSubscription } from 'rest-hooks';
import { AuthManager } from 'resources/AuthManager';
import { useDayNightThemeState } from 'themes/hooks';

const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { theme } = useDayNightThemeState();

    useEffect(() => {
        const prevTheme = theme === 'light' ? 'dark' : 'light';
        document.body.classList.remove(`${prevTheme}-mode`);
        document.body.classList.add(`${theme}-mode`);
    }, [theme]);
    return (
        <CacheProvider
            managers={[new AuthManager(), new NetworkManager(), new SubscriptionManager(PollingSubscription)]}
        >
            <ThemeProvider theme={{ mode: theme }}>
                <AuthProvider>{children}</AuthProvider>
            </ThemeProvider>
        </CacheProvider>
    );
};

export { AppProviders };
