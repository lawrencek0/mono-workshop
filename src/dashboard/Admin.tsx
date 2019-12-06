import React from 'react';
import { RouteComponentProps, Link, navigate } from '@reach/router';
import { Main } from 'navigation/Main';
import styled from 'styled-components/macro';
import tw from 'tailwind.macro';
import { useResource } from 'rest-hooks';
import { EventResource } from 'resources/EventResource';
import { UserResource } from 'resources/UserResource';
import { LogResource } from 'resources/LogResource';
import { GroupResource } from 'resources/GroupResource';
import { useTable, usePagination } from 'react-table';
import { StyledTable, StyledTh, StyledTd, Pagination } from 'groups/group/Table';
import { PrimaryButton, FlatButton } from 'shared/buttons';
import moment from 'moment';
import { StyledTitle } from 'groups/group/Page';
import { AppointmentResource } from 'resources/AppointmentResource';

const UsersTable: React.FC<{
    users: UserResource[];
}> = ({ users }) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        gotoPage,
        nextPage,
        previousPage,
        pageCount,
    } = useTable(
        {
            columns: [
                { Header: 'Name', id: 'name', accessor: r => `${r.firstName} ${r.lastName}` },
                { Header: 'Role', id: 'role', accessor: r => r.role as string },
            ],
            data: users,
        },
        usePagination,
    );

    return (
        <TableWrapper>
            <StyledTitle>Users</StyledTitle>
            <Link to="/settings/users">Add Users</Link>
            <Pagination>
                <FlatButton onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    {'<<'}
                </FlatButton>
                <FlatButton onClick={() => previousPage()} disabled={!canPreviousPage}>
                    {'<'}
                </FlatButton>
                <FlatButton onClick={() => nextPage()} disabled={!canNextPage}>
                    {'>'}
                </FlatButton>
                <FlatButton onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                    {'>>'}
                </FlatButton>
            </Pagination>
            <StyledTable {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr key={undefined} {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <StyledTh key={undefined} {...column.getHeaderProps()}>
                                    {column.render('Header')}
                                </StyledTh>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map(row => {
                        prepareRow(row);
                        return (
                            <tr key={undefined} {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    if (cell.column.Header === 'Role') {
                                        return (
                                            <StyledTd key={undefined} {...cell.getCellProps()}>
                                                <select defaultValue={row.original.role}>
                                                    <option value="student">Student</option>
                                                    <option value="faculty">Faculty</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </StyledTd>
                                        );
                                    }
                                    return (
                                        <StyledTd key={undefined} {...cell.getCellProps()}>
                                            {cell.render('Cell')}
                                        </StyledTd>
                                    );
                                })}
                                <StyledTd>
                                    <PrimaryButton variant="danger">Delete</PrimaryButton>
                                    <FlatButton css={tw`ml-4`} variant="disabled">
                                        Edit
                                    </FlatButton>
                                </StyledTd>
                            </tr>
                        );
                    })}
                </tbody>
            </StyledTable>
        </TableWrapper>
    );
};

const GroupsTable: React.FC<{
    groups: GroupResource[];
}> = ({ groups }) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        gotoPage,
        nextPage,
        previousPage,
        pageCount,
    } = useTable(
        {
            columns: [{ Header: 'Name', id: 'name', accessor: r => r.name }],
            data: groups,
        },
        usePagination,
    );

    return (
        <TableWrapper>
            <StyledTitle>Groups</StyledTitle>
            <Pagination>
                <FlatButton onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    {'<<'}
                </FlatButton>
                <FlatButton onClick={() => previousPage()} disabled={!canPreviousPage}>
                    {'<'}
                </FlatButton>
                <FlatButton onClick={() => nextPage()} disabled={!canNextPage}>
                    {'>'}
                </FlatButton>
                <FlatButton onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                    {'>>'}
                </FlatButton>
            </Pagination>
            <StyledTable {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr key={undefined} {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <StyledTh key={undefined} {...column.getHeaderProps()}>
                                    {column.render('Header')}
                                </StyledTh>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map(row => {
                        prepareRow(row);
                        return (
                            <tr
                                key={undefined}
                                onClick={() => navigate(`/groups/${row.original.id}`)}
                                {...row.getRowProps()}
                            >
                                {row.cells.map(cell => {
                                    return (
                                        <StyledTd key={undefined} {...cell.getCellProps()}>
                                            {cell.render('Cell')}
                                        </StyledTd>
                                    );
                                })}
                                <StyledTd>
                                    <PrimaryButton variant="danger">Delete</PrimaryButton>
                                    <FlatButton css={tw`ml-4`} variant="disabled">
                                        Edit
                                    </FlatButton>
                                </StyledTd>
                            </tr>
                        );
                    })}
                </tbody>
            </StyledTable>
        </TableWrapper>
    );
};

const EventsTable: React.FC<{
    events: EventResource[];
}> = ({ events }) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        gotoPage,
        nextPage,
        previousPage,
        pageCount,
    } = useTable(
        {
            columns: [
                { Header: 'Title', id: 'title', accessor: r => r.title },
                { Header: 'Start', id: 'start', accessor: r => moment(r.start).format('MM/DD/YYYY hh:mm') },
                { Header: 'End', id: 'end', accessor: r => moment(r.end).format('MM/DD/YYYY hh:mm') },
            ],
            data: events,
        },
        usePagination,
    );

    return (
        <TableWrapper>
            <StyledTitle>Events</StyledTitle>
            <Pagination>
                <FlatButton onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    {'<<'}
                </FlatButton>
                <FlatButton onClick={() => previousPage()} disabled={!canPreviousPage}>
                    {'<'}
                </FlatButton>
                <FlatButton onClick={() => nextPage()} disabled={!canNextPage}>
                    {'>'}
                </FlatButton>
                <FlatButton onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                    {'>>'}
                </FlatButton>
            </Pagination>
            <StyledTable {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr key={undefined} {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <StyledTh key={undefined} {...column.getHeaderProps()}>
                                    {column.render('Header')}
                                </StyledTh>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map(row => {
                        prepareRow(row);
                        return (
                            <tr
                                key={undefined}
                                css={tw`hover:cursor-pointer`}
                                onClick={() => navigate(`/calendar/events/${row.original.id}`)}
                                {...row.getRowProps()}
                            >
                                {row.cells.map(cell => {
                                    return (
                                        <StyledTd key={undefined} {...cell.getCellProps()}>
                                            {cell.render('Cell')}
                                        </StyledTd>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </StyledTable>
        </TableWrapper>
    );
};

const AppointmentsTable: React.FC<{
    appointments: AppointmentResource[];
}> = ({ appointments }) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        gotoPage,
        nextPage,
        previousPage,
        pageCount,
    } = useTable(
        {
            columns: [
                { Header: 'Title', id: 'title', accessor: r => r.title },
                { Header: 'Faculty', id: 'faculty', accessor: r => `${r.faculty?.firstName} ${r.faculty?.lastName}` },
            ],
            data: appointments,
        },
        usePagination,
    );

    return (
        <TableWrapper>
            <StyledTitle>Appointments</StyledTitle>
            <Pagination>
                <FlatButton onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    {'<<'}
                </FlatButton>
                <FlatButton onClick={() => previousPage()} disabled={!canPreviousPage}>
                    {'<'}
                </FlatButton>
                <FlatButton onClick={() => nextPage()} disabled={!canNextPage}>
                    {'>'}
                </FlatButton>
                <FlatButton onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                    {'>>'}
                </FlatButton>
            </Pagination>
            <StyledTable {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr key={undefined} {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <StyledTh key={undefined} {...column.getHeaderProps()}>
                                    {column.render('Header')}
                                </StyledTh>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map(row => {
                        prepareRow(row);
                        return (
                            <tr
                                css={tw`hover:cursor-pointer`}
                                key={undefined}
                                onClick={() => navigate(`/calendar/appointments/${row.original.id}`)}
                                {...row.getRowProps()}
                            >
                                {row.cells.map(cell => {
                                    return (
                                        <StyledTd key={undefined} {...cell.getCellProps()}>
                                            {cell.render('Cell')}
                                        </StyledTd>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </StyledTable>
        </TableWrapper>
    );
};

const LogsTable: React.FC<{
    logs: LogResource[];
}> = ({ logs }) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        gotoPage,
        nextPage,
        previousPage,
        pageCount,
    } = useTable(
        {
            columns: [
                {
                    Header: 'Timestamp',
                    id: 'timestamp',
                    accessor: r => moment(r.timestamp).format('MM/DD/YYYY HH:mm:ss'),
                },
                { Header: 'Message', id: 'message', accessor: r => r.message as string },
            ],
            data: logs,
        },
        usePagination,
    );

    return (
        <TableWrapper>
            <StyledTitle>Logs</StyledTitle>
            <Pagination>
                <FlatButton onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    {'<<'}
                </FlatButton>
                <FlatButton onClick={() => previousPage()} disabled={!canPreviousPage}>
                    {'<'}
                </FlatButton>
                <FlatButton onClick={() => nextPage()} disabled={!canNextPage}>
                    {'>'}
                </FlatButton>
                <FlatButton onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                    {'>>'}
                </FlatButton>
            </Pagination>
            <StyledTable {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr key={undefined} {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <StyledTh key={undefined} {...column.getHeaderProps()}>
                                    {column.render('Header')}
                                </StyledTh>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map(row => {
                        prepareRow(row);
                        return (
                            <tr key={undefined} {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return (
                                        <StyledTd key={undefined} {...cell.getCellProps()}>
                                            {cell.render('Cell')}
                                        </StyledTd>
                                    );
                                })}
                                <StyledTd>
                                    <PrimaryButton variant="danger">Delete</PrimaryButton>
                                </StyledTd>
                            </tr>
                        );
                    })}
                </tbody>
            </StyledTable>
        </TableWrapper>
    );
};

const Dashboard: React.FC<RouteComponentProps> = () => {
    const [appointments, events, groups, users, logs] = useResource(
        [AppointmentResource.listShape(), {}],
        [EventResource.listShape(), {}],
        [GroupResource.listShape(), {}],
        [UserResource.listShape(), {}],
        [LogResource.listShape(), {}],
    );

    return (
        <Main>
            <Wrapper>
                {users.length > 0 && <UsersTable users={users} />}
                {groups.length > 0 && <GroupsTable groups={groups} />}
                {appointments.length > 0 && <AppointmentsTable appointments={appointments} />}
                {events.length > 0 && <EventsTable events={events} />}
                {logs.length > 0 && <LogsTable logs={logs} />}
            </Wrapper>
        </Main>
    );
};

const Wrapper = styled.div`
    display: grid;
    grid-gap: 2em;
    grid-auto-rows: 25vw;
`;

const TableWrapper = styled.div`
    ${tw`overflow-y-scroll m-4 border-2 border-gray-400`}
`;

export default Dashboard;
