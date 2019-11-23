import React, { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { AuthProvider } from 'auth/hooks';
import { themes } from 'theme';
import { CacheProvider, NetworkManager, SubscriptionManager, PollingSubscription } from 'rest-hooks';
import { AuthManager } from 'resources/AuthManager';

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
