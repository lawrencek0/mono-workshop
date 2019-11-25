import React from 'react';
import { useTable, usePagination } from 'react-table';
import { GroupUserResource } from 'resources/GroupResource';

export const Table: React.FC<{
    users: GroupUserResource[];
    actions?: React.ReactElement;
}> = ({ users, actions }) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        gotoPage,
        nextPage,
        previousPage,
        pageCount,
        // state: { pageIndex },
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
        <div>
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr key={undefined} {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th key={undefined} {...column.getHeaderProps()}>
                                    {column.render('Header')}
                                </th>
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
                                        <td key={undefined} {...cell.getCellProps()}>
                                            {cell.render('Cell')}
                                        </td>
                                    );
                                })}
                                {actions}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div className="pagination">
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    {'<<'}
                </button>{' '}
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                    {'<'}
                </button>{' '}
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                    {'>'}
                </button>{' '}
                <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                    {'>>'}
                </button>{' '}
                {/* <span>
                    Page{' '}
                    <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>{' '}
                </span> */}
            </div>
        </div>
    );
};
