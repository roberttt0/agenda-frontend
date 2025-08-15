import React from 'react';
import { useMediaQuery } from 'react-responsive';

export default function Test() {
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 768px)' });

    return (
        <div style={{ padding: 20 }}>
            <h1>Test useMediaQuery</h1>
            <p>Viewport width: {window.innerWidth}px</p>
            <p>isTabletOrMobile: {isTabletOrMobile ? '✅ TRUE' : '❌ FALSE'}</p>
        </div>
    );
}
