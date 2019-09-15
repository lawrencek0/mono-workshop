import { MdHome, MdEvent, MdGroup, MdSettings } from 'react-icons/md';
import { IconType } from 'react-icons/lib/cjs';

// Represents commonly included properties with the routes
export type Route = {
    title?: string;
    to: string;
    Icon: IconType | React.FC<{}>;
    isSecondary?: boolean;
};

export const routes: Route[] = [
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
