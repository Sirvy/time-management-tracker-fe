import axios, { AxiosHeaders } from 'axios';
import { API_BASE_URL } from '../../Config/config';
import { getToken, isTokenValid, storeToken } from '../../Services/AuthService';

export enum RestMethods {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE'
}

interface UseRestCallerParams {
    url: string;
    method: RestMethods;
    body?: any;
    headers?: Record<string, string>;
}

export const get = <D = any>(url: string, headers?: Record<string, string>) =>
    RestCaller<D>({ url, method: RestMethods.GET, headers });

export const post = <D = any>(url: string, body?: any, headers?: Record<string, string>) =>
    RestCaller<D>({ url, method: RestMethods.POST, body, headers });

export const put = <D = any>(url: string, body?: any, headers?: Record<string, string>) =>
    RestCaller<D>({ url, method: RestMethods.PUT, body, headers });

export const del = <D = any>(url: string, headers?: Record<string, string>) =>
    RestCaller<D>({ url, method: RestMethods.DELETE, headers });


interface RestCallerParams {
    url: string;
    method: RestMethods;
    body?: any;
    headers?: Record<string, string>;
}

const buildConfig = <D = any>(params: RestCallerParams): any => ({
    baseURL: API_BASE_URL,
    url: params.url,
    method: params.method,
    headers: params.headers ? AxiosHeaders.from(params.headers) : undefined,
    data: params.body,
    withCredentials: true
});

export const RestCaller = async <D = any>(params: {
    url: string,
    method: RestMethods,
    body?: any,
    headers?: Record<string, string>,
}) => {
    if (isTokenValid()) {
        params.headers = {
            ...params.headers,
            Authorization: `Bearer ${getToken()}`
        };
    }

    try {
        const response = await axios.request<D>(buildConfig(params));
        return response.data;
    } catch (error) {
        if (error instanceof axios.AxiosError && error.response?.status === 401) {
            const refreshedResponse = await axios.post(`${API_BASE_URL}/auth/refresh-token`);
            if (refreshedResponse.status === 200) {
                storeToken(refreshedResponse.data.accessToken);
                params.headers = {
                    ...params.headers,
                    Authorization: `Bearer ${getToken()}`
                };

                const response = await axios.request<D>(buildConfig(params));
                return response.data;
            } else {
                window.dispatchEvent(new Event('logout'));
            }
        }
        throw error;
    }
};