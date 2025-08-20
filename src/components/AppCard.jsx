import React from "react";
import {Card, Divider} from "antd";
import {UserOutlined} from "@ant-design/icons";
import styles from '../styles/card.module.css'
import {Building, Calendar, Clock, Locate, Mail, MapPin, Phone, Users} from "lucide-react"

export default function AppCard({data}) {

    return (
        <Card style={{width: "300px", height: "280px"}}>
            <div className={styles.mainInfo}>
                {data.type === "employee" ? (
                    <>
                        <UserOutlined style={{fontSize: "32px", alignSelf: "flex-end", paddingBottom: "1px"}}/>
                        <div className={styles.nameJob}>
                            <span className={styles.nameJobName}>{data.object.firstName} {data.object.lastName}</span>
                            <span className={styles.nameJobJob}>{data.object.job}</span>
                        </div>
                    </>
                ) : data.type === "company" ? (
                    <>
                        <Building size={32} style={{alignSelf: "flex-end", paddingBottom: "1px"}}/>
                        <div className={styles.nameJob}>
                            <span className={styles.nameJobName}>{data.object.name}</span>
                            <span className={styles.nameJobJob}>{data.object.cui}</span>
                        </div>
                    </>
                ) : data.type === "workPoint" ? (
                    <>
                        <MapPin size={32} style={{alignSelf: "flex-end", paddingBottom: "1px"}}/>
                        <div className={styles.nameJob}>
                            <span className={styles.nameJobName}>{data.object.name}</span>
                            <span className={styles.nameJobJob}>{data.object.type}</span>
                        </div>
                    </>
                ) : data.type === "department" ? (
                    <>
                        <Users size={32} style={{alignSelf: "flex-end", paddingBottom: "1px"}}/>
                        <div className={styles.nameJob}>
                            <span className={styles.nameJobName}>{data.object.name}</span>
                            <span className={styles.nameJobJob}>{data.object.status}</span>
                        </div>
                    </>
                ) : null
                }

            </div>
            <div className={styles.jobInfo}>
                {data.type === "employee" ? (
                    <>
                        <div>
                            <Users size={16}/>
                            <span className={styles.jobDepartment}>{data.object.department}</span>
                        </div>
                        <div>
                            <MapPin size={16}/>
                            <span className={styles.jobWorkPoint}>{data.object.workPoint}</span>
                        </div>
                        <div>
                            <Building size={16}/>
                            <span className={styles.jobCompany}>{data.object.Company}</span>
                        </div>
                    </>
                ) : data.type === "company" ? (
                    <>
                        {/*<div>*/}
                        {/*    <Calendar size={16}/>*/}
                        {/*    <span className={styles.jobDepartment}>{company.yearCreated}</span>*/}
                        {/*</div>*/}
                    </>
                ) : data.type === "workPoint" ? (
                    <>
                        <div>
                            <Clock size={16}/>
                            <span className={styles.jobDepartment}>
                                {data.object.programStart.split("T")[1].substring(0, 5)} - {data.object.programEnd.split("T")[1].substring(0, 5)}
                            </span>
                        </div>
                        <div>
                            <Locate size={16}/>
                            <span className={styles.jobWorkPoint}>{data.object.address}, {data.object.county}</span>
                        </div>
                        <div>

                            <Building size={16}/>
                            <span className={styles.jobCompany}>{data.object.company}</span>
                        </div>
                    </>
                ) : data.type === "department" ? (
                    <>
                        <div>
                            <MapPin size={16}/>
                            <span className={styles.jobWorkPoint}>{data.object.workPoint}</span>
                        </div>
                        <div>
                            <Building size={16}/>
                            <span className={styles.jobCompany}>{data.object.company}</span>
                        </div>
                    </>
                ) : null
                }
            </div>
            <Divider size={"small"}/>
            <div className={styles.contact}>
                {data.type === "employee" ? (
                    <>
                        <div>
                            <Phone size={16}/>
                            <span>{data.object.phoneNumber}</span>
                        </div>
                        <div>
                            <Mail size={16}/>
                            <span>{data.object.email}</span>
                        </div>
                    </>
                ) : data.type === "company" ? (
                    <>
                        <div>
                            <Calendar size={16}/>
                            <span>{data.object.yearCreated}</span>
                        </div>
                    </>
                ) : data.type === "workPoint" ? (
                    <>
                        <div>
                            <Phone size={16}/>
                            <span>{data.object.phoneNumber}</span>
                        </div>
                    </>
                ) : data.type === "department" ? (
                    <>
                        <div>
                            <Phone size={16}/>
                            <span>{data.object.phoneNumber}</span>
                        </div>
                        <div>
                            <Mail size={16}/>
                            <span>{data.object.email}</span>
                        </div>
                    </>
                ) : null
                }
            </div>
        </Card>
    )
}