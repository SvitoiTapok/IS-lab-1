import React, {useState, useMemo, useEffect} from 'react';
import './humanCreator.css';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel, getPaginationRowModel,
    getSortedRowModel,
    useReactTable
} from "@tanstack/react-table";
import CustomError from "../util/error";
import humanService from "../services/HumanService";
import "../util/pagination.css"
import queryService from "../services/QueryService";
import {wait} from "@testing-library/user-event/dist/utils";
import coordinatesService from "../services/CoordinatesService";
import cityService from "../services/CityService";


/* global BigInt */
const QueryManager = () => {
    // const [humans, setHumans] = useState([]);
    const [data, setData] = useState({
        content: [],
        totalElements: 0,
        totalPages: 0
    });
    const [metersAbove, setMetersAbove] = useState('');
    const [population, setPopulation] = useState('');
    const [sorting, setSorting] = useState([]);
    const [error, setError] = useState('')
    const [errorVisible, setErrorVisible] = useState(false)
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 3,
    });
    const [response, setResponse] = useState('');
    const [classErr, setClassErr] = useState("error");
    const [cities, setCities] = useState([]);
    const [city1, setCity1] = useState({id: 0, name: ""});
    const [city2, setCity2] = useState({id: 0, name: ""});
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
    useEffect(() => {
        const initializeData = async () => {
            try {
                const [cities] = await Promise.all([
                    cityService.getAllCities(0, 10000000, 'id', 'asc'),
                ]);

                setCities(cities.content.map(x=> {return{id: x.id,name: x.name}}));

                if (cities.content.length > 0) {
                    setCity1(cities.content[0]);
                    setCity2(cities.content[0]);
                }
            } catch (err) {
                showError(err.toString());
            }
        };

        initializeData();
    }, []);
    const getMetersAbove = () => {
        const met = parseFloat(metersAbove.replace(",","."))
        if(isNaN(met)){
            showError("Значение высоты города над уровнем моря должно быть корректным значением")
            return null;
        }

        return met
    }
    const getPopulation = () => {
        try {
            const met = BigInt(population)
            if(met<1){
                showError("Значение населения города должно быть > 0")
                return null;
            }
            return met
        }catch (e){
            showError("Значение населения должно быть натуральным числом")
            return null;
        }

    }
    const getMACount = async () => {
        const met = getMetersAbove()
        if(!met) return null
        try {
            await queryService.countCitiesAboveSeaLevel(met).then(data => setResponse(data+"$")
            );
            setClassErr("notification")
            showError("Запрос успешно обработан")
            await wait(3000).then(()=>        setClassErr("error"))
        }catch (err){
            showError(err.toString())
            return null;
        }
    }
    const getPCount = async () => {
        const met = getPopulation()
        if(!met) return null
        try {
            await queryService.getCitiesWithPopulationLessThan(met).then(data => {
                console.log(data); setResponse(data.map(city => {return cityToString(city);
}).join("$"))}
            );
            setClassErr("notification")
            showError("Запрос успешно обработан")
            await wait(3000).then(()=>        setClassErr("error"))
        }catch (err){
            showError(err.toString())
            return null;
        }
    }

    const getTCodes = async () => {
        try {
            await queryService.getUniqueTelephoneCodes().then(data => {
                console.log(data); setResponse(data.join("$"))}
            );
            setClassErr("notification")
            showError("Запрос успешно обработан")
            await wait(3000).then(()=>        setClassErr("error"))
        }catch (err){
            showError(err.toString())
            return null;
        }
    }
    const getDistBU = async () => {
        try {
            await queryService.calculateRoute(city1.id, city2.id).then(data => {
                console.log(data); setResponse(data+"$")}
            );
            setClassErr("notification")
            showError("Запрос успешно обработан")
            await wait(3000).then(()=>        setClassErr("error"))
        }catch (err){
            showError(err.toString())
            return null;
        }
    }
    const getDistBM = async () => {
        try {
            await queryService.calculateMaxMinPopulationRoute().then(data => {
                console.log(data); setResponse(data+"$")}
            );
            setClassErr("notification")
            showError("Запрос успешно обработан")
            await wait(3000).then(()=>        setClassErr("error"))
        }catch (err){
            showError(err.toString())
            return null;
        }
    }
    const cityToString = (city) => {
        console.log(city)
        return `id:${city.id}, name: ${city.name}, coords:(id:${city.coordinates.id}, (${city.coordinates.x}, ${city.coordinates.y}), 
        creation_date: ${city.creationDate}, area:${city.area}, population:${city.population}, estDate:${city.establishmentDate},
        capital:${city.capital}, masl:${city.metersAboveSeaLevel}, popdensity:${city.populationDensity}, telephoneCode:${city.telephoneCode}
        climate:${city.climate}, governor:${city.human.name})`
    }
    const getAllCities = async () => {
        let sortBy = 'id';
        let sortOrder = 'asc';


        await cityService.getAllCities(
            0,
            10000000,
            sortBy,
            sortOrder,"","",""
        )
            .then(data => {
                console.log(data)
                setCities(data.content.map(x=> {return{id: x.id,name: x.name}}));
            })
            .catch(err => {
                showError(err.toString());
            });
    }
    return (
        <div className="creator">
            <span>
                Запросы
            </span>
            <table>
                <tbody>
                <tr>
                    <td>Количество городов, значение поля metersAboveSeaLevel которых больше заданного</td>
                    <td><input className="name-input" placeholder="Введите число" value={metersAbove}
                               onChange={e => setMetersAbove(e.target.value)}/></td>
                    <td>
                        <button className="create-button" onClick={getMACount}>Отправить запрос</button>
                    </td>
                </tr>
                <tr>
                    <td>Города, значение поля population которых меньше заданного</td>
                    <td><input className="name-input" placeholder="Введите число" value={population}
                               onChange={e => setPopulation(e.target.value)}/></td>
                    <td>
                        <button className="create-button" onClick={getPCount}>Отправить запрос</button>
                    </td>
                </tr>
                <tr>
                    <td>Уникальные телефонные коды</td>
                    <td></td>
                    <td>
                        <button className="create-button" onClick={getTCodes}>Отправить запрос</button>
                    </td>
                </tr>
                <tr>
                    <td>Рассчет расстояния между двумя городами</td>
                    <td>
                        Город 1
                        <select className="pagination-selector"
                                value={city1.id}
                                onChange={e => {
                                    const selectedCoord = cities.find(coord => coord.id === parseInt(e.target.value));
                                    setCity1(selectedCoord);

                                    // setCoordinate(e.target.value);
                                }}
                                onClick={() => getAllCities()}
                        >
                            {cities.map(x => (
                                <option key={x.id} value={x.id}>
                                    {"id:" + x.id + " (" + x.name + ")"}
                                </option>
                            ))}
                        </select>
                        Город2
                        <select className="pagination-selector"
                                value={city2.id}
                                onChange={e => {
                                    const selectedCoord = cities.find(coord => coord.id === parseInt(e.target.value));
                                    setCity2(selectedCoord);

                                    // setCoordinate(e.target.value);
                                }}
                                onClick={() => getAllCities()}
                        >
                            {cities.map(x => (
                                <option key={x.id} value={x.id}>
                                    {"id:" + x.id + " (" + x.name + ")"}
                                </option>
                            ))}
                        </select>
                    </td>
                    <td>
                        <button className="create-button" onClick={getDistBU}>Отправить запрос</button>
                    </td>
                </tr>
                <tr>
                    <td>Расстояние между городами с максимальным и минимальным населением</td>
                    <td></td>
                    <td>
                        <button className="create-button" onClick={getDistBM}>Отправить запрос</button>
                    </td>
                </tr>
                </tbody>
            </table>

            <span>Response: {response.split('$').map((line, index) => (
                line !== "" && <div key={index} style={{margin: "10px"}} className="creator">{line}</div>
            ))}
            </span>
            {error && <CustomError value={error} classname={classErr} isVisible={errorVisible}/>}
        </div>

    );
};

export default QueryManager;