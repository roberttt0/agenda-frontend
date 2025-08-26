import React from 'react';
import {Card} from 'antd';
import styles from '../styles/workpointcard.module.css'
import {Building, Building2, MapPin, Phone} from 'lucide-react'
import EmployeesDrawer from "./EmployeesDrawer.jsx";
import {useMediaQuery} from "react-responsive";

export default function WorkPointCard({wp}) {

    const isMobile = useMediaQuery({query: '(max-width: 768px)'});

    return (
        <Card
            style={{width: "100%"}}
        >
            <div className={styles.card}>
                <div className={styles.name}>
                    <Building size={15}/>
                    <div style={{fontSize: "15px"}}>{wp.name}</div>
                </div>

                {!isMobile && (
                    <>
                        <div className={styles.address}>
                            <MapPin size={15}/>
                            <div style={{fontSize: "15px"}}>{wp.address}, {wp.county}</div>
                        </div>
                        <div className={styles.company}>
                            <Building2 size={15}/>
                            <div style={{fontSize: "15px"}}>{wp.company}</div>
                        </div>
                        <div className={styles.phoneNumber}>
                            <Phone size={15}/>
                            <div style={{fontSize: "15px"}}>{wp.phoneNumber}</div>
                        </div>
                    </>
                )}

                <div className={styles.button}>
                    <EmployeesDrawer id={wp.id}/>
                </div>
            </div>
        </Card>
    )
}