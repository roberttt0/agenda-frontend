import React, {useEffect, useState} from "react";
import {Button, Input, Select} from "antd";
import {
    getCompanies,
    getCounties,
    getDepartments,
    getDepartmentsInfo,
    getJobs,
    getJobsInfo,
    getWorkPoints
} from "../api/agendaApi.jsx";
import styles from "../styles/loading.module.css";
import {useIsMobile} from "../services/AppService.jsx";

export default function AdvancedSearchSelect({onFiltersChange}) {

    const [companies, setCompanies] = useState([])
    const [workPoints, setWorkPoints] = useState([])
    const [departments, setDepartments] = useState([])
    const [jobs, setJobs] = useState([])
    const [counties, setCounties] = useState([])

    const [loading, setLoading] = useState(true);
    const isMobile = useIsMobile()

    const [companyOption, setCompanyOption] = useState()
    const [workPointOption, setWorkPointOption] = useState()
    const [departmentOption, setDepartmentOption] = useState()
    const [jobOption, setJobOption] = useState()
    const [countyOption, setCountyOption] = useState()
    const [phone, setPhone] = useState("")

    useEffect(() => {
        fetchData()
    }, []);

    useEffect(() => {
        onFiltersChange({
            company: companyOption,
            workPoint: workPointOption,
            department: departmentOption,
            job: jobOption,
            county: countyOption,
            phone: phone
        });
    }, [companyOption, workPointOption, departmentOption, jobOption, countyOption, phone, onFiltersChange]);

    const fetchData = () => {
        Promise.all([
            getCompanies(),
            getWorkPoints(),
            getDepartments(),
            getJobs(),
            getDepartmentsInfo(),
            getJobsInfo(),
            getCounties()
        ])
            .then(([companiesData, workPointsData, departmentsData, jobsData, departmentsInfoData, jobsInfoData, countyData]) => {
                const departmentsGrouped = departmentsInfoData.data.map(di => ({
                    departmentInfoId: di.id,
                    departmentName: di.name,
                    departments: departmentsData.data
                        .filter(d => d.departmentNameId === di.id)
                        .map(d => ({
                            departmentId: d.id,
                            workPointId: d.workPointId,
                            companyId: d.companyId
                        }))
                }))

                const jobsGrouped = jobsInfoData.data.map(ji => ({
                    jobInfoId: ji.id,
                    jobName: ji.name,
                    jobs: jobsData.data
                        .filter(j => j.jobNameId === ji.id)
                        .map(j => ({
                            jobId: j.id,
                            departmentId: j.departmentId,
                            departmentInfoId: j.departmentInfoId,
                            workPointId: j.workPointId,
                            companyId: j.companyId
                        }))
                }))

                setCompanies(companiesData.data)
                setWorkPoints(workPointsData.data)
                setDepartments(departmentsData.data)
                setDepartments(departmentsGrouped)
                setJobs(jobsGrouped)
                setCounties(countyData.data)

                setLoading(false)
            })
            .catch(err => console.log(err))
    }

    const filteredCompanies = companies
        .filter(c => {
            if (workPointOption) {
                const wp = workPoints.find(w => w.id === workPointOption);
                return wp?.companyId === c.id;
            }
            if (departmentOption) {
                const depInfo = departments.find(di => di.departmentInfoId === departmentOption);

                if (!depInfo) return false;

                return depInfo.departments.some(dp => dp.companyId === c.id);
            }
            if (jobOption) {
                const jobInfo = jobs.find(ji => ji.jobInfoId === jobOption)

                if (!jobInfo) return false

                return jobInfo.jobs.some(j => j.companyId === c.id)
            }
            if (countyOption) {
                return workPoints.some(wp => wp.companyId === c.id && wp.county === countyOption)
            }
            return true;
        })
        .map(i => ({label: i.name, value: i.id}))

    const filteredWorkPoints = workPoints
        .filter(wp => {
            if (companyOption)
                return wp.companyId === companyOption;
            if (departmentOption) {
                const depInfo = departments.find(di => di.departmentInfoId === departmentOption);

                if (!depInfo) return false;

                return depInfo.departments.some(dp => dp.workPointId === wp.id);
            }
            if (jobOption) {
                const jobInfo = jobs.find(ji => ji.jobInfoId === jobOption)

                if (!jobInfo) return false

                return jobInfo.jobs.some(j => j.workPointId === wp.id)
            }
            if (countyOption) {
                return wp.county === countyOption
            }
            return true;
        })
        .map(i => ({label: i.name, value: i.id}))

    const filteredDepartments = departments
        .filter(di => {
            return di.departments.some(dep => {
                if (workPointOption)
                    return dep.workPointId === workPointOption;
                if (companyOption) {
                    return dep.companyId === companyOption
                }
                if (jobOption) {
                    const jobInfo = jobs.find(ji => ji.jobInfoId === jobOption)

                    if (!jobInfo) return false

                    return jobInfo.jobs.some(j => j.departmentInfoId === di.departmentInfoId)
                }
                if (countyOption) {
                    return workPoints.some(wp => wp.id === dep.workPointId && wp.county === countyOption)
                }
                return true;
            });
        })
        .map(i => ({label: i.departmentName, value: i.departmentInfoId}))

    const filteredJobs = jobs
        .filter(ji => {
            return ji.jobs.some(j => {
                if (departmentOption) {
                    return j.departmentInfoId === departmentOption;
                }
                if (workPointOption) {
                    return j.workPointId === workPointOption
                }
                if (companyOption) {
                    return j.companyId === companyOption
                }
                if (countyOption) {
                    return workPoints.some(wp => wp.id === j.workPointId && wp.county === countyOption)
                }
                return true;
            })

        })
        .map(i => ({label: i.jobName, value: i.jobInfoId}))

    const filteredCounties = counties
        .filter(c => {
            if (companyOption) {
                return workPoints.some(wp => wp.county === c.name && wp.companyId === companyOption)
            }
            if (workPointOption) {
                const wp = workPoints.find(w => w.id === workPointOption);
                return wp?.county === c.name;
            }
            if (departmentOption) {
                const depInfo = departments.find(di => di.departmentInfoId === departmentOption);

                if (!depInfo) return false;

                return depInfo.departments.some(dp => workPoints.some(wp => wp.id === dp.workPointId && wp.county === c.name));
            }
            if (jobOption) {
                const jobInfo = jobs.find(ji => ji.jobInfoId === jobOption)

                if (!jobInfo) return false

                return jobInfo.jobs.some(j => workPoints.some(wp => wp.id === j.workPointId && wp.county === c.name));
            }
            return true;
        })
        .map(i => ({label: i.name, value: i.name}))

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setPhone(value);
        }
    };

    const handleReset = () => {
        setCompanyOption(null)
        setWorkPointOption(null)
        setDepartmentOption(null)
        setJobOption(null)
        setCountyOption(null)
        setPhone("")
    }

    useEffect(() => {
        if (!filteredCompanies.some(f => f.value === companyOption))
            setCompanyOption(null)
    }, [filteredCompanies, companyOption]);

    useEffect(() => {
        if (!filteredWorkPoints.some(f => f.value === workPointOption))
            setWorkPointOption(null)
    }, [filteredWorkPoints, workPointOption]);

    useEffect(() => {
        if (!filteredDepartments.some(f => f.value === departmentOption))
            setDepartmentOption(null)
    }, [filteredDepartments, departmentOption]);

    useEffect(() => {
        if (!filteredJobs.some(f => f.value === jobOption))
            setJobOption(null)
    }, [filteredJobs, jobOption]);

    useEffect(() => {
        if (!filteredCounties.some(f => f.value === countyOption))
            setCountyOption(null)
    }, [filteredCounties, countyOption]);

    if (loading) {
        return (
            <div className={styles.spinner}></div>
        );
    }


    return (
        <div style={{display: "flex", flexDirection: "column", gap: "20px", maxWidth: "100vw"}}>
            <div style={{display: "flex", gap: "20px", flexWrap:"wrap"}}>
                <Select
                    style={{width: isMobile ? 100 : 200}}
                    placeholder={"Companie"}
                    value={companyOption}
                    onChange={val => setCompanyOption(val)}
                    options={filteredCompanies}
                />
                <Select
                    style={{width: isMobile ? 100 : 200}}
                    placeholder={"Punct de lucru"}
                    value={workPointOption}
                    onChange={val => setWorkPointOption(val)}
                    options={filteredWorkPoints}
                />
                <Select
                    style={{width: isMobile ? 100 : 200}}
                    placeholder={"Departament"}
                    value={departmentOption}
                    onChange={val => setDepartmentOption(val)}
                    options={filteredDepartments}

                />
            </div>
            <div style={{display: "flex", gap: "20px"}}>
                <Select
                    style={{width: isMobile ? 100 : 200}}
                    placeholder={"Job"}
                    value={jobOption}
                    onChange={val => setJobOption(val)}
                    options={filteredJobs}
                />

                <Select
                    style={{width: isMobile ? 100 : 200}}
                    placeholder={"Judet"}
                    value={countyOption}
                    onChange={val => setCountyOption(val)}
                    options={filteredCounties}
                />

                <Input
                    style={{width: isMobile ? 100 : 200}}
                    placeholder={"Telefon"}
                    value={phone}
                    onChange={handlePhoneChange}
                    maxLength={10}
                />
            </div>

            <div style={{display: "flex", justifyContent:"center", gap: "20px"}}>
                <Button
                    onClick={handleReset}
                    type={"primary"}
                    style={{width: 200}}
                >
                    Reseteaza filtrele
                </Button>
            </div>
        </div>
    );

}