import React, {useEffect, useState} from "react";
import SearchHeader from "../components/SearchHeader.jsx";
import {Layout} from "antd";
import styles from '../styles/info.module.css'
import {getWorkPoints} from "../api/agendaApi.jsx";
import WorkPointCard from "../components/WorkPointCard.jsx";

export default function WorkPoints() {

    const [data, setData] = useState([])

    useEffect(() => {
        getWorkPoints()
            .then((workPoints) => {
                const filteredData =
                    workPoints.data.map(i => ({
                        key: `workPoint-${i.id}`,
                        type: "workPoint",
                        object: i
                    }))
                        .sort((wp1, wp2) => wp1.object.name.localeCompare(wp2.object.name))
                        .reduce(
                            (acc, curr) => {
                                const firstLetter = curr.object.name[0].toUpperCase()
                                if (!acc[firstLetter])
                                    acc[firstLetter] = []
                                acc[firstLetter].push(curr);
                                return acc;
                            },
                            {}
                        )

                setData(filteredData);
            })
            .catch(err => console.error(err))
    }, []);

    function getColorFromLetter(letter) {
        const colors = ["#FFD700", "#87CEEB", "#90EE90", "#FFB6C1", "#FFA07A"];
        const index = letter.charCodeAt(0) % colors.length;
        return colors[index];
    }

    return (
        <Layout className={styles.infoLayout}>
            <SearchHeader/>
            <Layout.Content className={styles.workPointsLayout}>
                {
                    Object.entries(data).map(([letter, items]) => (
                        <div key={letter} className={styles.category}>
                            <div className={styles.letter} style={{backgroundColor: getColorFromLetter(letter)}}>{letter}</div>
                            <div className={styles.cards}>
                            {
                                items.map(wp => <WorkPointCard key={`${wp.key}`} wp={wp.object} />)
                            }
                            </div>
                        </div>
                    ))
                }
            </Layout.Content>
            <Layout.Footer className={styles.infoFooter}>
                Footer
            </Layout.Footer>
        </Layout>
    )
}