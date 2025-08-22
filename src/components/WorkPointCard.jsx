import React from 'react';
import {Button, Card} from 'antd';
import styles from '../styles/workpointcard.module.css'
import {Building, MapPin, Building2, Phone} from 'lucide-react'

export default function WorkPointCard({wp}) {
    return (
        <Card
            style={{width: "100%"}}
        >
            <div className={styles.card}>
                <div className={styles.name}>
                    <Building size={15} />
                    <div style={{fontSize: "15px"}}>{wp.name}</div>
                </div>
                <div className={styles.address}>
                    <MapPin size={15}/>
                    <div style={{fontSize: "15px"}}>{wp.address}, {wp.county}</div>
                </div>
                <div className={styles.company}>
                    <Building2 size={15} />
                    <div style={{fontSize: "15px"}}>{wp.company}</div>
                </div>
                <div className={styles.phoneNumber}>
                    <Phone size={15} />
                    <div style={{fontSize: "15px"}}>{wp.phoneNumber}</div>
                </div>
                <div className={styles.listButton}>
                    <Button>Vezi lista de contacte</Button>
                </div>
            </div>
        </Card>
    )
}