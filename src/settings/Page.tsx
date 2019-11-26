import React, { Suspense } from 'react';
import { RouteComponentProps, Router } from '@reach/router';
import styled from 'styled-components/macro';
import tw from 'tailwind.macro';
import { Main } from 'navigation/Main';
import { Item, NavLink, StyledTitle } from 'groups/group/Page';
import { media } from 'themes/theme';
import { FormWrapper } from 'shared/inputs/styles';
import { NetworkErrorBoundary } from 'rest-hooks';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';
import { useDayNightThemeDispatch } from 'themes/hooks';

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
    return (
        <>
            <StyledTitle>Calendar Settings</StyledTitle>
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
