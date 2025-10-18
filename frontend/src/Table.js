import React, { useState, useEffect, useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    flexRender,
} from '@tanstack/react-table';
import './table.css';

const MainTable = () => {
    const [users, setUsers] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const data = [
            {
                id: 1,
                name: "John Smith",
                email: "john.smith@gmail.com",
                createdAt: "2024-01-15T10:30:00.000Z"
            },
            {
                id: 2,
                name: "Jane Johnson",
                email: "jane.johnson@company.com",
                createdAt: "2024-02-20T14:45:00.000Z"
            },
            {
                id: 3,
                name: "Alex Brown",
                email: "alex.brown@yahoo.com",
                createdAt: "2024-03-10T09:15:00.000Z"
            },
            {
                id: 4,
                name: "Sarah Davis",
                email: "sarah.davis@outlook.com",
                createdAt: "2024-01-05T16:20:00.000Z"
            },
            {
                id: 5,
                name: "Mike Wilson",
                email: "mike.wilson@enterprise.org",
                createdAt: "2024-04-01T11:00:00.000Z"
            }
        ];
        setUsers(data);
    };

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
            },
            {
                accessorKey: 'email',
                header: 'Email',
                cell: info => info.getValue(),
                enableSorting: true,
            },
            {
                accessorKey: 'createdAt',
                header: 'Created At',
                cell: info => new Date(info.getValue()).toLocaleString(),
            },
        ],
        []
    );

    const table = useReactTable({
        data: users,
        columns,
        state: {
            sorting,
            globalFilter,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
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
                                    <input
                                        type="text"
                                        placeholder={`Filter ${header.column.columnDef.header}`}
                                        value={header.column.getFilterValue()}
                                        onChange={e => header.column.setFilterValue(e.target.value)}
                                        className="filter-input"
                                    />
                                </div>
                                <span>
                                    <button onClick={header.column.getToggleSortingHandler()}></button>
                                </span>

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
        </div>
    );
};

export default MainTable;