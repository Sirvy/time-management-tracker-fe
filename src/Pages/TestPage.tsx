import React, { useEffect, useState } from 'react';
import { get } from '../api/utils/RestCaller';

interface TestPageProps {
    message: string;
}

export const TestPage = () => {

    const [data, setData] = useState<TestPageProps | null>(null);

    useEffect(() => {
        get('/test')
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
