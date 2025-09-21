import { useQuery } from 'react-query';
import { get } from '../utils/RestCaller';
import { Category } from '../../Interface/interface';

export const useFetchCategoryList = () => {
    return useQuery('categories', async () => {
        return get<Category[]>('/user/categories');
    });
};