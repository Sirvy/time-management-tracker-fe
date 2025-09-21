// export const API_BASE_URL = process?.env.REACT_APP_BACKEND_HOST || '';
// export const NODE_ENV = process?.env.NODE_ENV || 'development';
// export const ENABLE_MOCKING = process?.env.ENABLE_MOCKING || 'false';

export const API_BASE_URL = import.meta.env.VITE_BACKEND_HOST || 'http://localhost:5000';
export const NODE_ENV = import.meta.env.VITE_ENV || 'development';
export const ENABLE_MOCKING = import.meta.env.VITE_ENABLE_MOCKS || 'false';