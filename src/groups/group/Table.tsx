import React from 'react';
import { useTable, usePagination } from 'react-table';
import { GroupUserResource } from 'resources/GroupResource';
import styled from 'styled-components/macro';
import tw from 'tailwind.macro';
import { FlatButton, PrimaryButton } from 'shared/buttons';
import { useFetcher } from 'rest-hooks';

export const Table: React.FC<{
    users: GroupUserResource[];
    canModify: boolean;
    groupId?: string;
}> = ({ users, groupId, canModify }) => {
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
    const update = useFetcher(GroupUserResource.partialUpdateShape());
    const deleter = useFetcher(GroupUserResource.deleteShape());

    const handleRoleChange = (user: GroupUserResource) => async (
        e: React.ChangeEvent<HTMLSelectElement>,
    ): Promise<void> => {
        await update({ id: user.id, groupId }, { role: e.target.value as 'member' | 'mod' | 'owner' });
    };

    const handleUserDelete = async (user: GroupUserResource): Promise<void> => {
        await deleter({ id: user.id, groupId }, undefined);
    };

    return (
        <div>
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
                                {canModify && (
                                    <>
                                        <StyledTd>
                                            <select
                                                defaultValue={row.original.role}
                                                onChange={handleRoleChange(row.original as GroupUserResource)}
                                            >
                                                <option value="member">Member</option>
                                                <option value="mod">Mod</option>
                                                <option value="owner">Admin</option>
                                            </select>
                                        </StyledTd>
                                        <StyledTd>
                                            <PrimaryButton
                                                variant="danger"
                                                onClick={() => handleUserDelete(row.original as GroupUserResource)}
                                            >
                                                Delete?
                                            </PrimaryButton>
                                        </StyledTd>
                                    </>
                                )}
                            </tr>
                        );
                    })}
                </tbody>
            </StyledTable>
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
        </div>
    );
};

const Pagination = styled.div`
    ${tw`flex justify-between py-4`}
`;

const StyledTable = styled.table`
    ${tw`text-left w-full border-collapse`}
`;

const StyledTh = styled.th`
    ${tw`py-4 px-6 font-bold uppercase text-sm text-gray-dark border-b`}
`;

export const StyledTd = styled.td`
    ${tw`py-4 px-6 border-b border-gray-500`}
`;
