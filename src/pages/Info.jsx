import React, {useEffect, useMemo, useState} from "react";
import {Layout} from "antd";
import styles from '../styles/info.module.css'
import AppCard from "../components/AppCard.jsx";
import {getCompanies, getDepartments, getEmployees, getWorkPoints} from "../api/agendaApi.jsx";
import {normalizeString} from "../services/AppService.jsx";
import loadingStyles from '../styles/loading.module.css'
import SearchHeader from "../components/SearchHeader.jsx";
import queryString from 'query-string';
import {useLocation} from "react-router-dom";

export default function Info() {

    const [loading, setLoading] = useState(true);
    const location = useLocation();

    const filters = useMemo(() => {
        return queryString.parse(location.search, {parseNumbers: true});
    }, [location.search]);

    const [data, setData] = useState([])

    useEffect(() => {
        Promise.all([
            getCompanies(),
            getWorkPoints(),
            getDepartments(),
            getEmployees()
        ])
            .then(([companies, workPoints, departments, employees]) => {

                const filteredOptions = [
                    ...companies.data.map(i => ({
                        value: `${i.name} - Companie`,
                        key: `company-${i.id}`,
                        type: "company",
                        object: i
                    })),
                    ...workPoints.data.map(i => ({
                        value: `${i.name} - Punct de Lucru`,
                        key: `workpoint-${i.id}`,
                        type: "workPoint",
                        object: i
                    })),
                    ...departments.data.map(i => ({
                        value: `${i.name} ${i.company} - Departament`,
                        key: `department-${i.id}`,
                        type: "department",
                        object: i
                    })),
                    ...employees.data.map(i => ({
                        value: `${i.firstName} ${i.lastName}`,
                        key: `employee-${i.id}`,
                        type: "employee",
                        object: i
                    }))
                ].filter(option => {
                        const queryWords = normalizeString(filters.value).split(/\s+/).filter(Boolean);
                        const optionValue = option.value.toLowerCase();
                        const hasFilters = Object.entries(filters)
                            .filter(([key]) => key !== "value")
                            .some(([, val]) => Boolean(val));
                        const isEmpty = v => v === null || v === "" || v === undefined;

                        if (hasFilters) {
                            if (option.type === "employee") {
                                return (
                                    queryWords.every(word => optionValue.includes(word)) &&
                                    (isEmpty(filters.company) || option.object.companyId === filters.company) &&
                                    (isEmpty(filters.workPoint) || option.object.workPointId === filters.workPoint) &&
                                    (isEmpty(filters.department) || option.object.departmentInfoId === filters.department) &&
                                    (isEmpty(filters.job) || option.object.jobInformationId === filters.job) &&
                                    (isEmpty(filters.county) ||
                                        workPoints.data.find(wp => wp.id === option.object.workPointId)?.county === filters.county) &&
                                    (isEmpty(filters.phone) || option.object.phoneNumber.includes(filters.phone))
                                );

                            }
                            return false
                        }
                        return queryWords.every(word => optionValue.includes(word));
                    }
                );
                setData(filteredOptions);
                setLoading(false)
            })
            .catch(err => {
                setLoading(false)
                console.error(err);
            });

    }, [filters])

    if (loading) {
        return (
            <div className={loadingStyles.spinner}></div>
        );
    }

    return (
        <Layout className={styles.infoLayout}>
            <SearchHeader/>
            <Layout.Content className={styles.infoContent}>
                {
                    data.length ? (
                        data.map(item => {
                            return (
                                <AppCard key={item.key} data={item}/>
                            )
                        })
                    ) : <p style={{fontSize: "16px"}}>Nu s-au gasit rezultate pentru cautarea ta</p>
                }
            </Layout.Content>
            <Layout.Footer className={styles.infoFooter}>
                Footer
            </Layout.Footer>
        </Layout>
    )
}