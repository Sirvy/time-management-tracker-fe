import axios, { AxiosError } from 'axios';
import { useMutation } from 'react-query';
import { API_BASE_URL } from '../../Config/config';

export const useLogin = () => {
    return useMutation<any, AxiosError, { username: string, password: string }>(
        async ({ username, password }: { username: string, password: string }) => {
            const response = await axios.post(`${API_BASE_URL}/auth/login`, {
                username,
                password
            });
            return response.data;
        }
    );
};
