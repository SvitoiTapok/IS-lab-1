import React, {useState, useMemo, useEffect} from 'react';
import './humanCreator.css';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel, getPaginationRowModel,
    getSortedRowModel,
    useReactTable
} from "@tanstack/react-table";
import CustomError from "./error";
import "./pagination.css"
import coordinatesService from "./services/CoordinatesService";

const CoordCreator = () => {
    const [data, setData] = useState({
        content: [],
        totalElements: 0,
        totalPages: 0
    });
    const [x, setX] = useState('');
    const [y, setY] = useState('');
    const [sorting, setSorting] = useState([]);
    const [error, setError] = useState('')
    const [errorVisible, setErrorVisible] = useState(false)
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 3,
    });

    const showError = (errorMessage) => {
        setError(errorMessage);
        if (errorVisible) {
            return;
        }
        setErrorVisible(true);

        setTimeout(() => {
            setErrorVisible(false);
        }, 3000);
    };
    const callServer= async () => {
        let sortBy = 'id';
        let sortOrder = 'asc';

        if (sorting.length > 0) {
            sortBy = sorting[0].id;
            sortOrder = sorting[0].desc ? 'desc' : 'asc';
        }

        await coordinatesService.getAllCoordinates(
            pagination.pageIndex,
            pagination.pageSize,
            sortBy,
            sortOrder
        )
            .then(data => {
                setData(data);
            })
            .catch(err => {
                showError(err.toString());
            });
    }
    useEffect(() => {
        callServer()
        const intervalId = setInterval(callServer, 5000)

        return () => clearInterval(intervalId);
    }, [pagination.pageIndex, pagination.pageSize, sorting]);


    const addCoord =async () => {
        const floatX = parseFloat(x.replace(',','.'));
        if(isNaN(floatX)){
            showError('X должен быть корректным числом с плавающей запятой')
            return;
        }
        const floatY = parseInt(y);
        if(isNaN(floatY)){
            showError('X должен быть корректным числом')
            return;
        }
        if(floatY<=-563){
            showError('Y должен быть больше -563')
            return;
        }

        try{
            await coordinatesService.addCoordinates({x: floatX, y: floatY});
            await callServer()
        }catch(err){
            showError(err.toString());
            return;
        }
        setError('');
        setX('');
        setY('');

    }
    const columns = useMemo(
        () => [
            {
                accessorKey: 'id',
                header: 'ID',
                cell: info => parseInt(info.getValue()),
            },
            {
                accessorKey: 'x',
                header: 'X',
                cell: info => info.getValue(),

            },
            {
                accessorKey: 'y',
                header: 'Y',
                cell: info => info.getValue(),
            }
            ], []);
    const table = useReactTable({
        data: data.content,
        columns,
        state: {
            pagination,
            sorting
        },
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
        pageCount: data.totalPages || 0,
    });
    return (
        <div className="creator">
            <span>
                Координаты
            </span>
            <div className="input-group">
                <input
                    placeholder="X"
                    value={x}
                    onChange={(e) => {
                        setX(e.target.value);
                        setError('');
                    }
                    }
                    className="name-input"/>
                <input
                    placeholder="Y"
                    value={y}
                    onChange={(e) => {
                        setY(e.target.value);
                        setError('');
                    }
                    }
                    className="name-input"/>
                <button onClick={() => {
                    addCoord()
                }}
                        className="create-button-coord">
                    Добавить координаты
                </button>
            </div>
            <table className="w-full">
                <thead>
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <th
                                key={header.id}
                                className="text-left border"
                                style={{cursor: 'pointer'}}
                            >
                                {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                )}
                                <button className="sort-button" onClick={header.column.getToggleSortingHandler()}>↕
                                </button>
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
            {error && <CustomError value={error} isVisible={errorVisible}/>
            }
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

export default CoordCreator;