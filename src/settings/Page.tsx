import React, { Suspense, useState, useMemo } from 'react';
import { RouteComponentProps, Router } from '@reach/router';
import styled from 'styled-components/macro';
import tw from 'tailwind.macro';
import { Main } from 'navigation/Main';
import { Item, NavLink, StyledTitle } from 'groups/group/Page';
import { media } from 'themes/theme';
import { FormWrapper } from 'shared/inputs/styles';
import { NetworkErrorBoundary, useResource } from 'rest-hooks';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';
import { useDayNightThemeDispatch } from 'themes/hooks';
import { FlatButton } from 'shared/buttons';
import { GroupEventResource } from 'resources/GroupResource';
import { EventResource } from 'resources/EventResource';
import { AppointmentResource } from 'resources/AppointmentResource';

const Page: React.FC<RouteComponentProps> = () => {
    return (
        <Main>
            <Wrapper>
                <Sidebar />
                <FormWrapper css={tw`m-auto lg:w-11/12`}>
                    <Suspense fallback={<div>Fetching settigns...</div>}>
                        <NetworkErrorBoundary>
                            <Router>
                                <General path="/" />
                                <Calendar path="/calendar" />
                            </Router>
                        </NetworkErrorBoundary>
                    </Suspense>
                </FormWrapper>
            </Wrapper>
        </Main>
    );
};

const General: React.FC<RouteComponentProps> = () => {
    const toggle = useDayNightThemeDispatch();

    return (
        <>
            <StyledTitle>General Settings</StyledTitle>
            <div>
                <label css={tw`mr-4 text-xl`} htmlFor="theme-toggler">
                    Toggle Theme
                </label>
                <Toggle
                    id="theme-toggler"
                    defaultChecked={true}
                    icons={false}
                    onChange={() => toggle({ type: 'toggle' })}
                />
            </div>
        </>
    );
};

const Calendar: React.FC<RouteComponentProps> = () => {
    const [{ value }, setExport] = useState({ value: 'csv' });
    const events = useResource(
        [GroupEventResource.fetchAll(), {}],
        [EventResource.listShape(), {}],
        [AppointmentResource.listShape(), {}],
    );

    const flattened = useMemo(() => events.flat(), [events]) as GroupEventResource[];

    const handleExport = (): void => {
        if (value === 'csv') {
            const lineArray = flattened.map(({ title, description, start, end }, index) => {
                const line = `${title},${description},${start},${end}`;
                if (index === 0) {
                    return 'type,title,description,start,end\n' + line;
                }
                return line;
            });
            const csvContent = lineArray.join('\n');
            const el = document.createElement('a');
            const file = new Blob([csvContent], { type: 'text/csv' });
            el.href = URL.createObjectURL(file);
            el.download = 'events.csv';
            document.body.appendChild(el);
            el.click();
        } else if (value === 'xlsx') {
            /// do this instead;
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        setExport({ value: e.target.value });
    };

    return (
        <>
            <StyledTitle>Calendar Settings</StyledTitle>
            <div>
                <label htmlFor="export"> Export Calendar</label>
                <select id="export" value={value} onChange={handleChange}>
                    <option value="csv">CSV</option>
                    <option value="xlsx">Excel Format</option>
                </select>
                <FlatButton onClick={handleExport}>Export Calendar</FlatButton>
            </div>
        </>
    );
};

const Sidebar: React.FC = () => {
    return (
        <aside>
            <ul>
                <Item>
                    <NavLink to="./">General</NavLink>
                </Item>
                <Item>
                    <NavLink to="./calendar">Calendar</NavLink>
                </Item>
            </ul>
        </aside>
    );
};

const Wrapper = styled.div`
    ${tw`flex flex-col mx-auto justify-center lg:w-2/3`}

    ${media.tablet} {
        display: grid;
        grid-template-columns: minmax(min-content, 25%) 1fr;
        justify-items: center;
    }
`;

export default Page;
