import React from "react";
import {Card, Divider} from "antd";
import {UserOutlined} from "@ant-design/icons";
import styles from '../styles/card.module.css'
import {Users, MapPin, Building, Phone, Mail} from "lucide-react"

export default function AppCard() {

    const user = {
        "id": 1,
        "firstName": "Elena",
        "lastName": "Popescu",
        "email": "elena.popescu@example.com",
        "phoneNumber": "078828412",
        "hireDate": "2017-01-04T00:00:00+00:00",
        "job": "Tester",
        "department": "DezvoltareSoft",
        "workPoint": "Amazon Web Services (AWS) Office",
        "Company": "Amazon",
        "createdAt": "2025-08-15T16:18:50+00:00",
        "updatedAt": "2025-08-15T16:18:50+00:00"
    }

    return (
        <Card style={{width: "300px", height: "280px"}}>
            <div className={styles.mainInfo}>
                <UserOutlined style={{fontSize: "32px", alignSelf: "flex-end", paddingBottom: "1px"}}/>
                <div className={styles.nameJob}>
                    <span className={styles.nameJobName}>{user.firstName} {user.lastName}</span>
                    <span className={styles.nameJobJob}>{user.job}</span>
                </div>
            </div>
            <div className={styles.jobInfo}>
                <div>
                    <Users size={16} />
                    <span className={styles.jobDepartment}>{user.department}</span>
                </div>
                <div>
                    <MapPin size={16} />
                    <span className={styles.jobWorkPoint}>{user.workPoint}</span>
                </div>
                <div>
                    <Building size={16} />
                    <span className={styles.jobCompany}>{user.Company}</span>
                </div>
            </div>
            <Divider size={"small"}/>
            <div className={styles.contact}>
                <div>
                    <Phone size={16} />
                    <span>{user.phoneNumber}</span>
                </div>
                <div>
                    <Mail size={16} />
                    <span>{user.email}</span>
                </div>
            </div>
        </Card>
    )
}