import React, {useCallback, useEffect, useState} from 'react';
import {Select, Space} from 'antd';
import {getCompanies, getDepartments, getJobs, getWorkPoints} from "../api/agendaApi.jsx";

export default function AdvancedSearchSelect() {

    const cityData = {
        Bacau: ['Onesti', 'Moinesti'],
        Jiangsu: ['Nanjing', 'Suzhou', 'Zhenjiang'],
    };
    const provinceData = ['Bacau', 'Jiangsu'];

    const [cities, setCities] = useState(cityData[provinceData[0]]);
    const [secondCity, setSecondCity] = useState(cityData[provinceData[0]][0]);
    const handleProvinceChange = value => {
        setCities(cityData[value]);
        setSecondCity(cityData[value][0]);
    };
    const onSecondCityChange = value => {
        setSecondCity(value);
    };


    const [companies, setCompanies] = useState([])
    const [workPoints, setWorkPoints] = useState([])
    const [departments, setDepartments] = useState([])
    const [jobs, setJobs] = useState([])

    const fetchCompanies = useCallback((w=null, j=null, d=null) => {
        getCompanies()
            .then((cmp) => {
                const data = cmp.data
                    .filter((option) => {
                        return (option.workPointId === w || w === null) && (option.jobId === j || j === null) && (option.departmentId === d || d === null)
                    })
                    setCompanies(data)
            })
    }, [])

    const fetchWorkPoints = useCallback((c=null, j=null, d=null) => {
        getWorkPoints()
            .then((cmp) => {
                const data = cmp.data
                    .filter((option) => {
                        return (option.companyId === c || c === null) && (option.jobId === j || j === null) && (option.departmentId === d || d === null)
                    })
                setWorkPoints(data)
            })
    }, [])

    const fetchDepartments = useCallback((c=null, w=null, j=null) => {
        getDepartments()
            .then((cmp) => {
                const data = cmp.data
                    .filter((option) => {
                        return (option.companyId === c || c === null) && (option.workPointId === w || w === null) && (option.jobId === j || j === null)
                    })
                setDepartments(data)
            })
    }, [])

    const fetchJobs = useCallback((c=null, w=null, d=null) => {
        getJobs()
            .then((cmp) => {
                const data = cmp.data
                    .filter((option) => {
                        return (option.companyId === c || c === null) && (option.workPointId === w || w === null) && (option.departmentId === d || d === null)
                    })
                setJobs(data)
            })
    }, [])

    useEffect(() => {
        fetchCompanies()
        fetchWorkPoints()
        fetchDepartments()
        fetchJobs()
    }, [fetchCompanies, fetchWorkPoints, fetchDepartments, fetchJobs]);

    useEffect(() => {
        console.log(companies)
        console.log(workPoints)
        console.log(departments)
        console.log(jobs)
    }, [companies, workPoints, departments, jobs]);

    return (
        <Space wrap>
            <Select
                defaultValue={provinceData[0]}
                style={{width: 120}}
                onChange={handleProvinceChange}
                options={provinceData.map(province => ({label: province, value: province}))}
            />
            <Select
                style={{width: 120}}
                value={secondCity}
                onChange={onSecondCityChange}
                options={cities.map(city => ({label: city, value: city}))}
            />
        </Space>
    );
};