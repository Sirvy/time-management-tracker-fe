import { useEffect, useState } from 'react';
import { useFetchCategoryList } from './data-hooks/useCategories';
import { Category } from '../Interface/interface';

export const useCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const { data, error, isFetched } = useFetchCategoryList();

    useEffect(() => {
        if (data === undefined || isFetched !== true) return;
        setCategories(data);
        setCategories((prev) => [...prev, {
            _id: '0',
            color: '#7F7F7F',
            name: 'Other'
        }]);

    }, [data, isFetched]);

    return {
        categories
    };
};