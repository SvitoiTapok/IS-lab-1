import React, {useState, useEffect, useMemo} from 'react';
import {useNavigate} from 'react-router-dom';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
} from '@tanstack/react-table';
import './table.css';
import '../util/pagination.css';
import coordinatesService from "../services/CoordinatesService";
import cityService from "../services/CityService";
import CustomError from "../util/error";
import cityCreator from "./CityCreator";
import editIcon from '../imgs/edit-icon.png';
import deleteIcon from '../imgs/delete-icon.png';
import {wait} from "@testing-library/user-event/dist/utils";

const MainTable = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({
        content: [],
        totalElements: 0,
        totalPages: 0
    });
    const [sorting, setSorting] = useState([]);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 3,
    });
    const [error, setError] = useState('')
    const [errorVisible, setErrorVisible] = useState(false)
    const [nameFilter, setNameFilter] = useState('')
    const [climateFilter, setClimateFilter] = useState('')
    const [humanFilter, setHumanFilter] = useState('')
    const [classn, setClassN] = useState('error')


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
    const coordsToString = (coord) => {
        if (coord == null)
            return ""
        return 'id:' + coord.id + ' (' + coord.x + ', ' + coord.y + ')'
    }


    const callServer = async () => {
        let sortBy = 'id';
        let sortOrder = 'asc';

        if (sorting.length > 0) {
            sortBy = sorting[0].id;
            sortOrder = sorting[0].desc ? 'desc' : 'asc';
        }
        console.log(nameFilter)

        await cityService.getAllCities(
            pagination.pageIndex,
            pagination.pageSize,
            sortBy,
            sortOrder,
            nameFilter,
            climateFilter,
            humanFilter
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
    }, [pagination.pageIndex, pagination.pageSize, sorting, nameFilter, climateFilter, humanFilter]);

    const handleDelete = async (cityId) => {
        try {
            await cityService.deleteCity(cityId);
            callServer();
            setClassN("notification")

            showError('Город успешно удален');
            await wait(3000).then(()=>        setClassN("error"))
        } catch (err) {
            showError('Ошибка при удалении города: ' + err.toString());
        }
    };

    // Функция редактирования города
    const handleEdit = (city) => {
        navigate('/edit-city', {
            state: {
                city: city,
            }
        });
        // Пример: setEditingCity(city); // если есть состояние для редактирования
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
                enableColumnFilter: true
            },
            {
                accessorKey: 'coordinates',
                header: 'Coordinates',
                cell: info => coordsToString(info.getValue()),
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
                cell: info => {
                    if (info.getValue()) return "YES"; else return "NO"
                },
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
                accessorKey: 'human',
                header: 'Governor',
                cell: info => info.getValue().name,
                enableSorting: true,
                enableColumnFilter: true
            },
            {
                id: 'actions',
                header: 'Actions',
                cell: ({row}) => (
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleEdit(row.original)}
                            className="edit-button"
                            title="Редактировать"
                        >
                            <img
                                src={editIcon}
                                alt="Edit"
                                className="action-icon"
                            />
                        </button>
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="delete-button"
                            title="Удалить"
                        >
                            <img
                                src={deleteIcon}
                                alt="Edit"
                                className="action-icon"
                            />
                        </button>
                    </div>
                ),
                enableSorting: false,
            },


        ],
        []
    );

    const table = useReactTable({
        data: data.content,
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
        manualPagination: true,
        pageCount: data.totalPages || 0,
    });

    return (
        <div className="creator" id="city_creator">
            <span>Основная таблица</span>
            <div>
                <span className="">Отфильтровать по имени</span>
                <input
                    placeholder="Фильтр по имени..."
                    value={nameFilter}
                    onChange={e => {
                        setNameFilter(e.target.value);
                    }}
                    className="name-input"
                />
            </div>
            <div>
                <span className="">Отфильтровать по климату</span>
                <input
                    placeholder="Фильтр по климату..."
                    value={climateFilter}
                    onChange={e => {
                        setClimateFilter(e.target.value);
                    }}
                    className="name-input"
                />
            </div>
            <div>
                <span className="">Отфильтровать по климату</span>
                <input
                    placeholder="Фильтр по имени губернатора..."
                    value={humanFilter}
                    onChange={e => {
                        setHumanFilter(e.target.value);
                    }}
                    className="name-input"
                />
            </div>
            <table className="w-full">
                <thead>
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <th
                                key={header.id}
                                className="text-left border"
                                onClick={header.column.getToggleSortingHandler()}
                                // onClick={header.column.getToggleSortingHandler()}
                            >
                                {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                )}
                                {/*<div className="column-filter">*/}
                                {/*    {header.column.columnDef.enableColumnFilter && <input*/}
                                {/*        type="text"*/}
                                {/*        placeholder={`Filter ${header.column.columnDef.header}`}*/}
                                {/*        value={header.column.getFilterValue()}*/}
                                {/*        onChange={e => header.column.setFilterValue(e.target.value)}*/}
                                {/*        className="filter-input"*/}
                                {/*    />}*/}
                                {/*    <span>*/}
                                {/*    <button className="sort-button" onClick={header.column.getToggleSortingHandler()}>↕</button>*/}
                                {/*</span>*/}
                                {/*</div>*/}
                            {header.column.getIsSorted() === 'asc' ? '↑' :
                                header.column.getIsSorted() === 'desc' ? '↓' : '↕'}

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
            {error && <CustomError value={error} classname={classn} isVisible={errorVisible}/>
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

export default MainTable;