import React, {useState, useEffect, useMemo} from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
} from '@tanstack/react-table';
import './table.css';
import './pagination.css';

const MainTable = () => {
    const [users, setUsers] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 3,
    });
    const columns = useMemo(
        () => [
            {
                accessorKey: 'id',
                header: 'ID',
                cell: info => info.getValue(),
            },
            {
                accessorKey: 'name',
                header: 'Name',
                cell: info => info.getValue(),
                enableSorting: true,
                enableColumnFilter: true
            },
            {
                accessorKey: 'coordinates',
                header: 'Coordinates',
                cell: info => info.getValue(),
                enableSorting: true,
                enableColumnFilter: false
            },
            {
                accessorKey: 'creationDate',
                header: 'Creation date',
                cell: info => new Date(info.getValue()).toLocaleString(),
                enableColumnFilter: false
            },
            {
                accessorKey: 'area',
                header: 'Area',
                cell: info => info.getValue(),
                enableSorting: true,
                enableColumnFilter: false
            },
            {
                accessorKey: 'population',
                header: 'Population',
                cell: info => info.getValue(),
                enableSorting: true,
                enableColumnFilter: false
            },
            {
                accessorKey: 'establishmentDate',
                header: 'Establishment Date',
                cell: info => info.getValue(),
                enableSorting: true,
                enableColumnFilter: false
            },
            {
                accessorKey: 'capital',
                header: 'Capital',
                cell: info => {if (info.getValue())return  "YES"; else return  "NO"},
                enableSorting: true,
            },
            {
                accessorKey: 'metersAboveSeaLevel',
                header: 'Meters ASL',
                cell: info => info.getValue(),
                enableSorting: true,
            },
            {
                accessorKey: 'populationDensity',
                header: 'population density',
                cell: info => info.getValue(),
                enableSorting: true,
            },
            {
                accessorKey: 'telephoneCode',
                header: 'Telephone code',
                cell: info => info.getValue(),
                enableSorting: true,
            },
            {
                accessorKey: 'climate',
                header: 'Climate',
                cell: info => info.getValue(),
                enableSorting: true,
                enableColumnFilter: true
            },
            {
                accessorKey: 'governor',
                header: 'Governor',
                cell: info => info.getValue(),
                enableSorting: true,
                enableColumnFilter: true
            },


        ],
        []
    );

    const table = useReactTable({
        data: users,
        columns,
        state: {
            pagination,
            sorting,
        },
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="p-2">
            <table className="w-full">
                <thead>
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <th
                                key={header.id}
                                className="text-left border"
                                // onClick={header.column.getToggleSortingHandler()}
                            >
                                {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                )}
                                <div className="column-filter">
                                    {header.column.columnDef.enableColumnFilter && <input
                                        type="text"
                                        placeholder={`Filter ${header.column.columnDef.header}`}
                                        value={header.column.getFilterValue()}
                                        onChange={e => header.column.setFilterValue(e.target.value)}
                                        className="filter-input"
                                    />}
                                    <span>
                                    <button className="sort-button" onClick={header.column.getToggleSortingHandler()}>↕</button>
                                </span>
                                </div>


                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody>
                {table.getRowModel().rows.map(row => (
                    <tr key={row.id}>
                        {row.getVisibleCells().map(cell => (
                            <td key={cell.id} className="border">
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
            {/*Пагинация*/}
            <div>
                <button className="vectors"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                >
                    {'<<'}
                </button>
                <button className="vectors"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                >
                    {'<'}
                </button>
                <button className="vectors"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                >
                    {'>'}
                </button>
                <button className="vectors"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                >
                    {'>>'}
                </button>
            </div>
            <span className="page">
                    Страница{' '}
                {table.getState().pagination.pageIndex + 1} из {table.getPageCount()}
            </span>

            <select className="pagination-selector"
                    value={table.getState().pagination.pageSize}
                    onChange={e => {
                        table.setPageSize(parseInt(e.target.value));
                    }}
            >
                {[3, 5, 10].map(x => (
                    <option key={x} value={x}>
                        Показать {x}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default MainTable;