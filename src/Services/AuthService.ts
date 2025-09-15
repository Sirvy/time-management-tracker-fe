import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { API_BASE_URL } from '../Config/config';

export const storeTokens = (accessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
};

export const removeTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
};

export const isTokenExpired = (token: string) => {
    try {
        const decoded = jwtDecode(token);
        if (!decoded || !decoded.exp) return true;
        const currentTime = Date.now() / 1000;
        return decoded.exp < currentTime;
    } catch (e) {
        return true;
    }
};

export const isTokenValid = () => {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) return false;
    if (isTokenExpired(accessToken)) return false;
    return true;
};

export const refreshTokenIfExpired = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken || !isTokenExpired(accessToken)) return;

    try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, { refreshToken }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        const newAccessToken = response.data.accessToken;

        localStorage.setItem('accessToken', newAccessToken);
    } catch (error) {
        console.error('Failed to refresh token', error);
    }
};

export const getToken = () => {
    return localStorage.getItem('accessToken');
};