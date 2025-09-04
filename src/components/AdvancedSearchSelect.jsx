import React, {useCallback, useEffect, useState} from 'react';
import {Button, Select, Space} from 'antd';
import {
    getCompanies,
    getCompaniesDepartments,
    getCompany,
    getDepartmentById,
    getDepartments,
    getJobs,
    getWorkPointById,
    getWorkPoints, getWorkPointsDepartments
} from "../api/agendaApi.jsx";

export default function AdvancedSearchSelect() {

    const [companiesData, setCompaniesData] = useState([])
    const [workPointsData, setWorkPointsData] = useState([])
    const [departmentsData, setDepartmentsData] = useState([])
    const [jobsData, setJobsData] = useState([])

    const [companyInput, setCompanyInput] = useState()
    const [workPointInput, setWorkPointInput] = useState()
    const [departmentInput, setDepartmentInput] = useState()
    const [jobInput, setJobInput] = useState()


    useEffect(() => {
        fetchCompanies()
    }, []);

    useEffect(() => {
        fetchWorkPoints()
    }, []);

    useEffect(() => {
        fetchDepartments()
    }, []);

    useEffect(() => {
        fetchJobs()
    }, []);

    useEffect(() => {
        // console.log(companiesData)
        // console.log(workPointsData)
        // console.log(departmentsData)
        // console.log(jobsData)
    }, [companiesData, workPointsData, departmentsData, jobsData]);

    const fetchCompanies = useCallback((w = null, j = null, d = null) => {
        getCompanies()
            .then((cmp) => {
                const data = cmp.data
                    .filter((option) => {
                        return (option.workPointId === w || w === null) && (option.jobId === j || j === null) && (option.departmentId === d || d === null)
                    })
                setCompaniesData(data)
            })
    }, [])

    const fetchWorkPoints = useCallback((c = null, j = null, d = null) => {
        getWorkPoints()
            .then((cmp) => {
                const data = cmp.data
                    .filter((option) => {
                        return (option.companyId === c || c === null) && (option.jobId === j || j === null) && (option.departmentId === d || d === null)
                    })
                setWorkPointsData(data)
            })
            .catch(err => console.error(err))
    }, [])

    const fetchDepartments = useCallback((c = null, w = null, j = null) => {
        getDepartments()
            .then((cmp) => {
                const data = cmp.data
                    .filter((option) => {
                        return (option.companyId === c || c === null) && (option.workPointId === w || w === null) && (option.jobId === j || j === null)
                    })

                const distinct = data.reduce((acc, curr) => {
                    !acc.some(item => item.departmentNameId === curr.departmentNameId) ? acc.push(curr) : null

                    return acc
                }, [])

                setDepartmentsData(distinct)
            })
    }, [])

    const fetchJobs = useCallback((c = null, w = null, d = null) => {
        getJobs()
            .then((cmp) => {
                const data = cmp.data
                    .filter((option) => {
                        return (option.companyId === c || c === null) && (option.workPointId === w || w === null) && (option.departmentId === d || d === null)
                    })

                const distinct = data.reduce((acc, curr) => {
                    !acc.some(item => item.job === curr.job) ? acc.push(curr) : null

                    return acc
                }, [])

                setJobsData(distinct)
            })
    }, [])


    const handleCompanyChange = value => {
        fetchWorkPoints(value)
        fetchDepartments(value)
        fetchJobs(value)

        setCompanyInput(value)
        setWorkPointInput(null)
        // setDepartmentInput(departmentsData.some(dep => dep.departmentNameId === departmentInput) ? departmentInput : null)
        setJobInput(jobsData.some(job => job.companyId === value && job.id === jobInput) ? jobInput : null)
    }

    const handleWorkPointChange = value => {
        setWorkPointInput(value)
        getWorkPointById(value)
            .then(result => {
                getCompany(result.data.company)
                    .then(cmp => setCompanyInput(cmp.data.name))
                    .catch(err => console.log(err))
            })
            .catch(err => console.error(err))

        fetchDepartments(null, value)
        getWorkPointsDepartments()
            .then(result => {
                const checkPromise = getDepartmentById(departmentInput)
                    .then(info => {
                        return result.data.some(item =>
                            item.id === value &&
                            info.data.department === item.departmentNameId
                            // info.data.workPoint === value
                        );
                    });

                checkPromise.then(isMatch => {
                    isMatch ? setDepartmentInput(departmentInput) : setDepartmentInput(null);
                });
            })
            .catch(err => {
                console.error(err);
            });
    }

    const handleDepartmentChange = value => {
        setDepartmentInput(value)
        getDepartmentById(value)
            .then((dept) => {
                const departmentNameId = dept.data.department

                getCompaniesDepartments()
                    .then(result => {
                        const filteredData = result.data.reduce((acc, curr) => {
                            if (curr.departmentNameId === departmentNameId && !acc.some((item) => item.id === curr.id))
                                acc.push(curr)

                            return acc
                        }, [])
                        setCompaniesData(filteredData)
                    })
                    .catch(err => console.error(err))

                getWorkPointsDepartments()
                    .then(result => {
                        const filteredData = result.data.reduce((acc, curr) => {
                            if (curr.departmentNameId === departmentNameId && !acc.some((item) => item.id === curr.id))
                                acc.push(curr)

                            return acc
                        }, [])
                        setWorkPointsData(filteredData)
                    })

            })
            .then(err => console.error(err))

    }

    const handleJobChange = value => {
        setJobInput(value)
    }

    const handleReset = () => {
        setDepartmentInput(null)
        setCompanyInput(null)
        setWorkPointInput(null)
        setJobInput(null)

        fetchCompanies()
        fetchWorkPoints()
        fetchDepartments()
        fetchJobs()
    }

    return (
        <Space wrap style={{paddingTop: "400px"}} size={"large"}>
            <Select
                style={{width: 200}}
                value={companyInput}
                onChange={(value) => handleCompanyChange(value)}
                options={companiesData.map(c => ({label: c.name, value: c.id}))}
                placeholder={"Companie"}
            />
            <Select
                style={{width: 200}}
                value={workPointInput}
                onChange={(value) => handleWorkPointChange(value)}
                options={workPointsData.map(w => ({label: w.name, value: w.id}))}
                placeholder={"Punct de lucru"}
            />

            <Select
                style={{width: 200}}
                value={departmentInput}
                onChange={(value) => handleDepartmentChange(value)}
                options={departmentsData.map(w => ({label: w.name, value: w.id}))}
                placeholder={"Departament"}
            />

            <Select
                style={{width: 200}}
                value={jobInput}
                onChange={(value) => handleJobChange(value)}
                options={jobsData.map(w => ({label: w.job, value: w.id}))}
                placeholder={"Functie"}
            />

            <Button
                onClick={handleReset}
            >
                Reseteaza filtrele
            </Button>
        </Space>

    );
};