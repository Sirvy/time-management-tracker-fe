import { useMutation, useQuery, useQueryClient } from 'react-query';
import { API_BASE_URL } from '../../Config/config';
import { Task } from '../../Interface/interface';
import { del, get, post } from '../utils/RestCaller';

export const useFetchTaskList = () => {
    return useQuery('tasks', async () => get('/tasks'));
};

export const useFetchTaskById = (taskId: string) => {
    return useQuery(['task', taskId], async () => get(`/tasks/${taskId}`));
};

export const useCreateTask = () => {
    const queryClient = useQueryClient();
    return useMutation(
        async (newTask: Task) => post(`${API_BASE_URL}/tasks`, newTask), {
            onSuccess: async () => {
                await queryClient.invalidateQueries('tasks');
            }
        }
    );
};

export const useDeleteTask = () => {
    const queryClient = useQueryClient();
    return useMutation(
        async (taskId: string) => del(`${API_BASE_URL}/tasks/${taskId}`), {
            onSuccess: async () => {
                await queryClient.invalidateQueries('tasks');
            }
        }
    );
};