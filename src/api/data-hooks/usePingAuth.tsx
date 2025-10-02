import { useMutation } from 'react-query';
import { AxiosError } from 'axios';
import { post } from '../utils/RestCaller';

export const usePingAuth = () => {
    return useMutation<any, AxiosError, null>(
        async () => {
            return post('/auth/check');
        }
    );
};