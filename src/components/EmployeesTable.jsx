import React, {useCallback, useEffect, useMemo, useState} from "react";
import {getEmployeesByWorkPointId, getWorkPointById} from "../api/agendaApi.jsx";
import {Table} from "antd";
import {Building} from 'lucide-react';
import {normalizeString, useIsMobile} from "../services/AppService.jsx";
import debounce from "lodash.debounce";
import styles from '../styles/loading.module.css'

export default function EmployeesTable({id, text}) {
    const [data, setData] = useState([]);
    const [wp, setWp] = useState();
    const [loading, setLoading] = useState(true);
    const isMobile = useIsMobile()

    useEffect(() => {
        getWorkPointById(id)
            .then(result => setWp(result.data))
            .catch(err => console.error(err));
    }, [id]);

    const fetchData = useCallback(() => {
        getEmployeesByWorkPointId(id)
            .then((d) => {
                const employees = d.data.map((item) => ({
                    ...item,
                    key: item.id,
                })).filter(option => {
                    const queryWords = normalizeString(text).split(/\s+/).filter(Boolean);
                    const optionValue = [option.firstName.toLowerCase(),
                        option.lastName.toLowerCase(),
                        option.job.toLowerCase(),
                        option.department.toLowerCase()
                    ].join(" ");

                    return queryWords.every(word => optionValue.includes(word));
                })

                setData(employees);
                setLoading(false)
            })
            .catch((err) => {
                console.error(err)
                setLoading(false)
            });
    }, [id, text]);

    const debounceFetcher = useMemo(() => {
        return (
            debounce(fetchData, 500)
        )
    }, [fetchData])

    useEffect(() => {
        if (!text) {
            fetchData()
        } else {
            debounceFetcher()
        }

        // debouceFetcher()
        return () => {
            debounceFetcher.cancel();
        };
    }, [debounceFetcher, text, fetchData]);

    if (loading) {
        return (
            <div className={styles.spinner}></div>
        );
    }

    const columns = [
        {
            title: 'Departament',
            dataIndex: 'department',
            key: 'department',
            onCell: (record, rowIndex) => {
                const sameDept = data.filter(item => item.department === record.department);
                const firstIndex = data.findIndex(item => item.department === record.department);

                if (rowIndex === firstIndex) {
                    return {
                        rowSpan: sameDept.length,
                        style: {verticalAlign: 'top'},
                    };
                }
                return {rowSpan: 0};
            },
        },
        {
            title: 'Functia',
            dataIndex: 'job',
            key: 'job',
            onCell: (record, rowIndex) => {
                const sameDept = data.filter(item => item.department === record.department);
                const sameJob = sameDept.filter(item => item.job === record.job);

                const firstIndexInDept = data.findIndex(
                    item => item.department === record.department && item.job === record.job
                );

                if (rowIndex === firstIndexInDept) {
                    return {
                        rowSpan: sameJob.length,
                        style: {verticalAlign: 'top'},
                    };
                }
                return {rowSpan: 0};
            },
        },
        {
            title: 'Nume si prenume',
            key: 'name',
            render: (_, record) => `${record.lastName} ${record.firstName}`,
        },
        {
            title: 'Tel. interior',
            dataIndex: 'phoneNumber',
            key: 'phone',
            render: text => <p style={{color: "#595959"}}>{text}</p>
        },
        {
            title: 'Adresa de email',
            dataIndex: 'email',
            key: 'email',
            render: text => <p style={{color: "#595959"}}>{text}</p>
        },
    ];

    return (
        <Table
            dataSource={data}
            columns={isMobile ? columns.slice(0, 3) : columns}
            pagination={false}
            sticky
            title={() => (
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "30px",
                    fontSize: "14px",
                    alignItems: "center"
                }}>
                    <Building size={24}/>
                    <div style={{fontWeight: "bold", color: "#34d399"}}>{wp?.name}</div>
                    {!isMobile && (
                        <>
                            <div>|</div>
                            <div style={{color: "#6B7280"}}>{wp?.address}, {wp?.county}</div>
                            <div>|</div>
                            <div style={{color: "#1E3A8A"}}>{wp?.phoneNumber}</div>
                        </>
                    )}
                </div>
            )}
            style={{minHeight: "100vh"}}
        />
    );
}
