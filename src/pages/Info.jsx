import React, {useEffect, useState} from "react";
import {Button, Layout} from "antd";
import styles from '../styles/info.module.css'
import {FileTextOutlined, UserOutlined} from "@ant-design/icons";
import {useMediaQuery} from "react-responsive";
import AppAutoComplete from "../components/AppAutoComplete.jsx";
import logo from "../assets/dedeman_logo.png"
import AppCard from "../components/AppCard.jsx";
import {useLocation} from "react-router-dom";
import {getCompanies, getDepartments, getEmployees, getWorkPoints} from "../api/agendaApi.jsx";
import queryString from "query-string";
import AppModal from "../components/AppModal.jsx";

export default function Info() {
    const isMobile = useMediaQuery({query: '(max-width: 768px)'});

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

    const normalizeString = (str) => {
        return str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();
    }

    return (
        <Layout className={styles.infoLayout}>
            <Layout.Header className={styles.infoHeader}>
                <div className={styles.logo}>
                    <Button
                        style={{backgroundImage: `url(${logo})`, backgroundSize: "cover", backgroundPosition: "center",
                        width: isMobile ? "32px" : "40px",
                            marginLeft : isMobile ? "10px" : "20px"
                        }}
                        size={isMobile ? "middle" : "large"}
                        href={'/'}
                    />
                </div>
                <div className={styles.searchBar}>
                    {
                        isMobile ? <AppModal /> :
                            <AppAutoComplete mobileWidth={"180px"} desktopWidth={"300px"} mobileSize={"medium"}
                                             desktopSize={"medium"} mobileSufix={"20px"} desktopSufix={"22px"}
                                             placeholder={"Cauta in agenda"} mobilePlaceholder={"Cauta in agenda"}/>
                    }
                </div>
                <div className={styles.icons}>
                    <Button
                        icon={<UserOutlined/>}
                        size={isMobile ? "middle" : "large"}
                    />
                    <Button
                        icon={<FileTextOutlined/>}
                        size={isMobile ? "middle" : "large"}
                    />
                </div>
            </Layout.Header>
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