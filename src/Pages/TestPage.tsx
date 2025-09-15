import React, { useEffect, useState } from 'react';

interface TestPageProps {
    message: string;
}

export const TestPage = () => {

    const [data, setData] = useState<TestPageProps | null>(null);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_HOST}/test`)
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => console.error('error', error));
    }, []);

    return (
        <div>
            <h1>Test Page</h1>
            <p>{data?.message}</p>
        </div>
    );
};
