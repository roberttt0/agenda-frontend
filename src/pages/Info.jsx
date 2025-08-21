import React, {useEffect, useState} from "react";
import {Layout} from "antd";
import styles from '../styles/info.module.css'
import AppCard from "../components/AppCard.jsx";
import {useLocation} from "react-router-dom";
import {getCompanies, getDepartments, getEmployees, getWorkPoints} from "../api/agendaApi.jsx";
import queryString from "query-string";
import SearchHeader from "../components/SearchHeader.jsx";
import {normalizeString} from "../services/AppService.jsx";

export default function Info() {
    const location = useLocation();

    const parsed = queryString.parse(location.search);
    const search = parsed.value || ''

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
                        const queryWords = normalizeString(search).split(/\s+/).filter(Boolean);
                        const optionValue = option.value.toLowerCase();

                        return queryWords.every(word => optionValue.includes(word));
                    }
                );

                setData(filteredOptions);

            })
            .catch(err => {
                console.error(err);
            });

    }, [search])

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