import React, { useEffect, useState } from 'react';
import { Avatar, Box, Container, Grid, Paper, Typography } from '@mui/material';
import TaskForm from '../Components/TaskForm';
import TaskList from '../Components/TaskList';
import { Task } from '../Interface/interface';
import { useTasks } from '../hooks/useTasks';
import { useCreateTask } from '../api/data-hooks/useTasks';
import { isTokenValid } from '../Services/AuthService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Providers/AuthProvider';

export const ProfilePage = () => {
    const [username, setUsername] = useState('');
    const { tasks } = useTasks();
    const createTask = useCreateTask();
    const navigate = useNavigate();
    const { setAuth } = useAuth();
    //const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        console.log('Tasks updated:', tasks);
    }, [tasks]);

    // useEffect(() => {
    //     const fetchProtectedData = async () => {
    //         await refreshTokenIfExpired();
    //         if (!isTokenValid()) {
    //             setAuth(false);
    //             navigate('/');
    //         }
    //         try {
    //             const response = await axios.get(`${API_BASE_URL}/user/profile`, {
    //                 headers: {
    //                     Authorization: `Bearer ${getToken()}`
    //                 }
    //             });
    //             setUsername(response.data.message);
    //         } catch (error) {
    //             console.error('Error fetching protected data:', error);
    //         }
    //     };
    //
    //     fetchProtectedData();
    // }, []);

    const handleTaskSubmit = async (newTask: Task) => {
        if (!isTokenValid()) {
            setAuth(false);
            navigate('/');
        }
        createTask.mutate(newTask, {
            onError: (error) => {
                console.error(error);
            }
        });
    };

    return (
        <Container maxWidth="xl">
            <Paper elevation={3} sx={{ padding: 3, marginTop: 5 }}>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <Avatar sx={{ width: 100, height: 100, mb: 2 }}>
                        {username.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography variant="h4" component="h1" gutterBottom>
                        {username}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        Welcome to your personal profile page!
                    </Typography>
                </Box>
            </Paper>
            <Grid container spacing={2} sx={{ padding: 2 }}>
                <Grid item xs={12} md={3} pr={2} sx={{ boxSizing: 'border-box' }}>
                    <TaskForm onSubmit={handleTaskSubmit} />
                </Grid>
                <Grid item xs={12} md={9} sx={{ borderLeft: 1, borderColor: 'divider' }}>
                    <TaskList tasks={tasks} />
                </Grid>
            </Grid>
        </Container>
    );
};
