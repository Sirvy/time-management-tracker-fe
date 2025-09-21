import { useEffect, useState } from 'react';
import { Task } from '../Interface/interface';
import { useFetchTaskList } from '../api/data-hooks/useTasks';

export const useTasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const { data, error, isFetched } = useFetchTaskList();

    useEffect(() => {
        if (data === undefined || !isFetched) return;
        setTasks(data.map((task: Task) => {
            return {
                _id: task._id,
                title: task.title,
                categoryId: task.categoryId ?? '0',
                date: new Date(task.date),
                description: task.description,
                timeSpent: task.timeSpent
            };
        }));
    }, [data, isFetched]);

    return {
        tasks
    };
};