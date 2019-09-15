import React from 'react';
import { storiesOf } from '@storybook/react';
import { MdHome } from 'react-icons/md';
import { NavItem } from 'components/sidebar/NavItem';

const props = {
    to: '/',
    title: 'Home',
    Icon: MdHome,
};

storiesOf('NavItem', module)
    .add('with default props', () => <NavItem {...props} />)
    .add('with active link', () => <NavItem {...props} to="/:*" />)
    .add('with no title', () => <NavItem {...props} title={undefined} />);
