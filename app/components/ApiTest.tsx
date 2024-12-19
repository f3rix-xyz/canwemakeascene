"use client";
import React, { useEffect } from 'react';

const ApiTest = () => {
    const deviceId = 'AEX4004';

    useEffect(() => {
        const testApi = async () => {
            try {
                console.log('Making API request...');
                const response = await fetch("http://localhost:8080/newWaterReading2/toast", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        // Adding CORS headers to request
                    },
                    body: JSON.stringify({ deviceId: deviceId }),
                });

                const data = await response.json();
                console.log('API Response:', data);
            } catch (error) {
                console.error('API Error:', error);
            }
        };

        testApi();
    }, []);

    return (
        <div className="p-4">
            <h1>API Test Component</h1>
            <p>Check browser console for API response</p>
        </div>
    );
};

export default ApiTest;