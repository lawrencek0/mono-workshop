import { MdHome, MdEvent, MdGroup, MdSettings, MdNotifications, MdExitToApp, MdAccountCircle } from 'react-icons/md';
import { IconType } from 'react-icons/lib/cjs';

// Represents commonly included properties with the routes
export type Route = {
    title?: string;
    to: string;
    Icon: IconType | React.FC<{}>;
    isSecondary?: boolean;
};

export const primaryRoutes: Route[] = [
    {
        to: '/',
        title: 'Home',
        Icon: MdHome,
    },
    {
        to: '/events',
        title: 'Events',
        Icon: MdEvent,
    },
    {
        to: '/groups',
        title: 'Groups',
        Icon: MdGroup,
    },
    {
        to: '/settings',
        title: 'Settings',
        Icon: MdSettings,
        isSecondary: true,
    },
];

export const secondayRoutes: Route[] = [
    {
        to: '/notifications',
        Icon: MdNotifications,
        isSecondary: true,
    },
    {
        to: '/logout',
        Icon: MdExitToApp,
        isSecondary: true,
    },
    {
        to: '/profile',
        Icon: MdAccountCircle,
        isSecondary: true,
    },
];
