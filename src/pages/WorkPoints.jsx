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

                setData(combineSmallKeys(filteredData));
                combineSmallKeys(filteredData)
            })
            .catch(err => console.error(err))
    }, []);

    function combineSmallKeys(obj, minElements = 3) {
        const result = {};
        const keys = Object.keys(obj).sort();
        const processedKeys = new Set();

        for (let i = 0; i < keys.length; i++) {
            const currentKey = keys[i];

            if (processedKeys.has(currentKey)) {
                continue;
            }

            let combinedKey = currentKey;
            let combinedItems = [...obj[currentKey]];
            processedKeys.add(currentKey);

            if (obj[currentKey].length < minElements) {
                for (let j = i + 1; j < keys.length && combinedItems.length < minElements; j++) {
                    const nextKey = keys[j];

                    if (!processedKeys.has(nextKey)) {
                        combinedKey += nextKey;
                        combinedItems = combinedItems.concat(obj[nextKey]);
                        processedKeys.add(nextKey);
                    }
                }

                if (combinedItems.length < minElements) {
                    for (let j = 0; j < i && combinedItems.length < minElements; j++) {
                        const prevKey = keys[j];

                        if (!processedKeys.has(prevKey)) {
                            combinedKey = prevKey + combinedKey;
                            combinedItems = obj[prevKey].concat(combinedItems);
                            processedKeys.add(prevKey);
                        }
                    }
                }
            }

            result[combinedKey] = combinedItems;
        }
        console.log(result)
        return result;
    }


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
                            <div className={styles.letter}
                                 style={{backgroundColor: getColorFromLetter(letter)}}>{letter}</div>
                            <div className={styles.cards}>
                                {
                                    items.map(wp => <WorkPointCard key={`${wp.key}`} wp={wp.object}/>)
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