import { AxiosError } from 'axios';
import { useMutation } from 'react-query';
import { post } from '../utils/RestCaller';

export const useLogin = () => {
    return useMutation<any, AxiosError, { username: string, password: string }>(
        async ({ username, password }: { username: string, password: string }) => {
            return post('/login', { username, password });
        }
    );
};
