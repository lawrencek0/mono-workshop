import React from 'react';
import * as queryString from 'query-string';
import { navigate } from '@reach/router';
import { FaPlus } from 'react-icons/fa';
import { FaCalendarPlus } from 'react-icons/fa';
import { FaUsers } from 'react-icons/fa';
import { Fab, Action } from 'react-tiny-fab';
import 'react-tiny-fab/dist/styles.css';

const FabWrapper: React.FC = () => {
    return (
        <Fab mainButtonStyles={{ background: '#ed64a6' }} icon={<FaPlus />} event="click">
            <Action
                text="New event"
                onClick={async () => {
                    await navigate('/calendar');
                    const params = queryString.stringify({ activateModal: true });
                    await navigate(`/calendar?${params}`);
                }}
            >
                <FaCalendarPlus />
            </Action>
            <Action text="New group" onClick={() => navigate('/groups/new')}>
                <FaUsers />
            </Action>
            <Action text="New group post" onClick={() => navigate('/groups/posts/new')}>
                <FaUsers />
            </Action>
        </Fab>
    );
};

export default FabWrapper;
