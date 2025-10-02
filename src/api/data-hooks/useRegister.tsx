import { AxiosError } from 'axios';
import { useMutation } from 'react-query';
import { post } from '../utils/RestCaller';

export const useRegister = () => {
    return useMutation<any, AxiosError, { username: string, password: string, email: string, captchaValue: string }>(
        async ({ username, password, email, captchaValue }: {
            username: string,
            password: string,
            email: string,
            captchaValue: string
        }) => {
            return post('/register', { username, password, email, captchaValue });
        }
    );
};
