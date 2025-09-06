import React, {useEffect, useState} from "react";
import SearchHeader from "../components/SearchHeader.jsx";
import {Layout} from "antd";
import styles from '../styles/info.module.css'
import {getWorkPoints} from "../api/agendaApi.jsx";
import WorkPointCard from "../components/WorkPointCard.jsx";
import {normalizeString} from "../services/AppService.jsx";
import {BookText} from "lucide-react";

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
                const sortedData = agendaSort(filteredData)
                // setData(filteredData);
                setData(sortedData)
            })
            .catch(err => console.error(err))
    }, []);

    function getColorFromLetter(letter) {
        const colors = ["#FFD700", "#87CEEB", "#90EE90", "#FFB6C1", "#FFA07A"];
        const index = letter.charCodeAt(0) % colors.length;
        return colors[index];
    }

    function agendaSort(wp) {
        const result = {}
        const alphabet = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('');
        const keys = Object.keys(wp).sort();

        let combinedKey = ""
        let combinedItems = []
        for (const letter of alphabet) {
            combinedKey += letter
            if (keys.includes(normalizeString(letter).toUpperCase()))
                combinedItems = combinedItems.concat(wp[letter])

            if (combinedItems.length > 2) {
                result[combinedKey] = combinedItems
                combinedKey = ""
                combinedItems = []
            }
        }

        if (combinedItems.length > 2)
            result[combinedKey] = combinedItems
        else {
            const keys2 = Object.keys(result)
            const lastKey = keys2[keys2.length - 1]
            combinedKey = lastKey + combinedKey
            combinedItems = result[lastKey].concat(combinedItems)
            delete result[lastKey]
            result[combinedKey] = combinedItems
        }
        return result
    }

    return (
        <Layout className={styles.infoLayout}>
            <SearchHeader/>
            <div className={styles.workPointsTitle}>
                <BookText size={30}/>
                <div>Lista puncte de lucru</div>
            </div>
            <Layout.Content className={styles.workPointsLayout}>
                {
                    Object.entries(data).map(([letter, items]) => (
                        <div key={letter} className={styles.category}>
                            <div className={styles.letter}>
                                {
                                    letter.length > 1 ? `${letter.at(0)}-${letter.at(-1)}` : letter.at(0)
                                }
                            </div>
                            <div className={styles.infoLetterLayout}>
                                <div className={styles.letterBackground}
                                     style={{backgroundColor: getColorFromLetter(letter)}}>
                                </div>
                                <div className={styles.cards}>
                                    {
                                        items.map(wp => <WorkPointCard key={`${wp.key}`} wp={wp.object}/>)
                                    }
                                </div>
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