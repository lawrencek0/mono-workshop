import { MdHome, MdEvent, MdGroup, MdSettings, MdNotifications, MdExitToApp, MdAccountCircle } from 'react-icons/md';
import { IconType } from 'react-icons/lib/cjs';

// Represents commonly included properties with the routes
export type Route = {
    title: RouteTitles;
    to: string;
    Icon: IconType | React.FC<{}>;
    isSecondary?: boolean;
};

export const primaryRoutes = [
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
] as const;

export const secondayRoutes = [
    {
        to: '/notifications',
        title: 'Notifications',
        Icon: MdNotifications,
    },
    {
        to: '/logout',
        title: 'Logout',
        Icon: MdExitToApp,
    },
    {
        to: '/profile',
        title: 'Profile',
        Icon: MdAccountCircle,
    },
] as const;

export type RouteTitles = (typeof primaryRoutes[number])['title'] | (typeof secondayRoutes[number])['title'];
