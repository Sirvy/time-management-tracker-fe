import axios, { AxiosError } from 'axios';
import { useMutation } from 'react-query';
import { API_BASE_URL } from '../../Config/config';

export const useRegister = () => {
    return useMutation<any, AxiosError, { username: string, password: string, email: string }>(
        async ({ username, password, email }: { username: string, password: string, email: string }) => {
            const response = await axios.post(`${API_BASE_URL}/auth/register`, {
                username,
                password,
                email
            });
            return response.data;
        }
    );
};
