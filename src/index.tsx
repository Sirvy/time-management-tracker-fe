import React from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';
import { ENABLE_MOCKING, NODE_ENV } from './Config/config';
import { browserMockWorker } from './api/mocks/browser';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const enableMocking = async () => {
    if (NODE_ENV != 'development' || ENABLE_MOCKING != 'true') {
        return;
    }

    await browserMockWorker.start();
    console.log('Mocking enabled');
};

enableMocking().then(() => {
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
});