import React from "react";
import { Collapse } from "antd";
const { Panel } = Collapse;

const workPoints = [
    "Alpha", "Alfa", "Alison",
    "Beta", "Bravo",
    "Charlie", "Charlie II", "Charlie III",
    "Delta", "Delta II"
];

export default function WorkPointsList() {
    // Grupare după prima literă
    const grouped = workPoints.reduce((acc, point) => {
        const firstLetter = point[0].toUpperCase();
        if (!acc[firstLetter]) acc[firstLetter] = [];
        acc[firstLetter].push(point);
        return acc;
    }, {});

    // Creare categorii
    const categories = Object.entries(grouped).map(([letter, points]) => ({
        category: points.length >= 3 ? letter : "Altele",
        points
    }));

    // Combinare puncte cu "Altele"
    const finalCategories = [];
    const others = [];

    categories.forEach(cat => {
        if (cat.category === "Altele") {
            others.push(...cat.points);
        } else {
            finalCategories.push(cat);
        }
    });

    if (others.length) finalCategories.push({ category: "Altele", points: others });

    return (
        <Collapse>
            {finalCategories.map(cat => (
                <Panel header={cat.category} key={cat.category}>
                    <ul>
                        {cat.points.map(p => <li key={p}>{p}</li>)}
                    </ul>
                </Panel>
            ))}
        </Collapse>
    );
}
