import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { API_BASE_URL } from '../../Config/config';
import { Task } from '../../Interface/interface';
import { getToken } from '../../Services/AuthService';


export const useFetchTaskList = () => {
    return useQuery('tasks', async () => {
        const response = await axios.get(`${API_BASE_URL}/tasks`, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        return response.data;
    });
};

export const useFetchTask = (taskId: string) => {
    return useQuery(['task', taskId], async () => {
        const response = await axios.get(`${API_BASE_URL}/tasks/${taskId}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        return response.data;
    });
};

export const useCreateTask = () => {
    const queryClient = useQueryClient();
    return useMutation(
        async (newTask: Task) => {
            const response = await axios.post(`${API_BASE_URL}/tasks`, newTask, {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });
            return response.data;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('tasks');
            }
        }
    );
};

export const useDeleteTask = () => {
    const queryClient = useQueryClient();
    return useMutation(
        async (taskId: string) => {
            const response = await axios.delete(`${API_BASE_URL}/tasks/${taskId}`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });
            return response.data;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('tasks');
            }
        }
    );
};