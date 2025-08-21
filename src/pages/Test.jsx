import React from 'react';
import AppModal from "../components/AppModal.jsx";

export default function Test() {

    const testLayout= {
        backgroundColor: "#515151",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }

    return (
        <div style={testLayout}>
            <AppModal />
        </div>
    );
}
