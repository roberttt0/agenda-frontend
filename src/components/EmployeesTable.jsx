import React, {useEffect, useState} from "react";
import {getEmployeesByWorkPointId, getWorkPointById} from "../api/agendaApi.jsx";
import {Button, Table} from "antd";
import {Building, X} from 'lucide-react';

export default function EmployeesTable({id}) {
    const [data, setData] = useState([]);
    const [wp, setWp] = useState();

    useEffect(() => {
        getWorkPointById(id)
            .then(result => setWp(result.data))
            .catch(err => console.error(err));

        getEmployeesByWorkPointId(id)
            .then((d) => {
                const employees = d.data.map((item) => ({
                    ...item,
                    key: item.id,
                }));
                setData(employees);
            })
            .catch((err) => console.error(err));
    }, [id]);

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
        },
        {
            title: 'Adresa de email',
            dataIndex: 'email',
            key: 'email',
        },
    ];

    return (
        <Table
            dataSource={data}
            columns={columns}
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
                    <div style={{fontWeight: "bold", color:"#34d399"}}>{wp?.name}</div>
                    <div>|</div>
                    <div style={{color: "#6B7280"}}>{wp?.address}, {wp?.county}</div>
                    <div>|</div>
                    <div style={{color: "#1E3A8A"}}>{wp?.phoneNumber}</div>
                </div>
            )}
            style={{minHeight: "100vh"}}
        />
    );
}
