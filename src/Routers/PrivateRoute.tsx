import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isTokenValid, refreshTokenIfExpired } from '../Services/AuthService';

export const PrivateRoute = () => {
    if (!isTokenValid()) {
        refreshTokenIfExpired();
    }

    const isAuthenticated = isTokenValid();
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};
