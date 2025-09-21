import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isTokenValid } from '../Services/AuthService';

export const PrivateRoute = () => {
    const isAuthenticated = isTokenValid();
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};
