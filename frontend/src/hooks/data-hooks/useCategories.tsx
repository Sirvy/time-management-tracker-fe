import axios from 'axios';
import { useQuery } from 'react-query';
import { API_BASE_URL } from '../../Config/config';
import { getToken } from '../../Services/AuthService';

export const useFetchCategoryList = () => {
    return useQuery('categories', async () => {
        const response = await axios.get(`${API_BASE_URL}/user/categories`, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        return response.data;
    });
};