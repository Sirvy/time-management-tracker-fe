import { jwtDecode } from 'jwt-decode';

export interface AccessTokenResponse {
    accessToken: string;
}

export const storeToken = (accessToken: string) => {
    localStorage.setItem('accessToken', accessToken);
};

export const removeTokens = () => {
    localStorage.removeItem('accessToken');
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
    return !isTokenExpired(accessToken);
};

// export const refreshTokenIfExpired = async () => {
//     const accessToken = localStorage.getItem('accessToken');
//     if (!accessToken || !isTokenExpired(accessToken)) return;
//
//     try {
//         const response = await post<AccessTokenResponse>(`/auth/refresh-token`);
//         const newAccessToken = response.accessToken;
//
//         localStorage.setItem('accessToken', newAccessToken);
//         return true;
//     } catch (error) {
//         console.error('Failed to refresh token', error);
//         return false;
//     }
// };

export const getToken = () => {
    return localStorage.getItem('accessToken');
};