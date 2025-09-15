import React, { useState } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import Timer from './Timer';
import { Category, Task } from '../Interface/interface';
import { useCategories } from '../hooks/useCategories';
import { isTokenValid, refreshTokenIfExpired } from '../Services/AuthService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Providers/AuthProvider';


interface TaskFormProps {
    onSubmit: (task: Task) => void;
}


const TaskForm: React.FC<TaskFormProps> = ({ onSubmit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [timeSpent, setTimeSpent] = useState('');
    const [date, setDate] = useState<Date | null>(new Date());
    const [category, setCategory] = useState('');
    const { categories } = useCategories();
    const navigate = useNavigate();
    const { setAuth } = useAuth();

// Parse timeSpent string into seconds
    const parseTimeSpent = (timeString: string): number => {
        const hours = timeString.match(/(\d+)\s*h(ours?)?/);
        const minutes = timeString.match(/(\d+)\s*m(inutes?)?/);
        const seconds = timeString.match(/(\d+)\s*s(econds?)?/);

        let totalSeconds = 0;

        if (hours) {
            totalSeconds += parseInt(hours[1]) * 3600;
        }

        if (minutes) {
            totalSeconds += parseInt(minutes[1]) * 60;
        }

        if (seconds) {
            totalSeconds += parseInt(seconds[1]);
        }

        return totalSeconds;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        await refreshTokenIfExpired();
        if (!isTokenValid()) {
            setAuth(false);
            navigate('/');
        }

        const timeSpentInSeconds = parseTimeSpent(timeSpent);
        setTimeSpent(timeSpentInSeconds.toString());

        if (title && date) {
            onSubmit({
                _id: null,
                title,
                description,
                timeSpent: timeSpentInSeconds,
                date: date as Date,
                categoryId: category
            });
            // Reset form fields
            setTitle('');
            setDescription('');
            setTimeSpent('');
            setCategory('0');
        }
    };

    const addTime = (time: number) => {
        const currentSeconds = parseTimeSpent(timeSpent);
        const newSeconds = currentSeconds + time;
        const hours = Math.floor(newSeconds / 3600);
        const minutes = Math.floor((newSeconds % 3600) / 60);
        const newTime = `${hours}h ${minutes}m`;
        setTimeSpent(newTime);
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h6" gutterBottom>
                Add New Task
            </Typography>

            <Timer />

            <TextField
                fullWidth
                label="Task Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                margin="normal"
            />
            <TextField
                fullWidth
                label="Task Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={3}
                margin="normal"
            />
            <TextField
                fullWidth
                label="Time Spent"
                value={timeSpent}
                onChange={(e) => setTimeSpent(e.target.value)}
                placeholder="e.g., 2 hours, 30 minutes"
                margin="normal"
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 2 }}>
                <Button onClick={() => addTime(300)} variant="contained" color="primary">5m</Button>
                <Button onClick={() => addTime(900)} variant="contained" color="primary">15m</Button>
                <Button onClick={() => addTime(1800)} variant="contained" color="primary">30m</Button>
                <Button onClick={() => addTime(3600)} variant="contained" color="primary">1h</Button>
                <Button onClick={() => addTime(7200)} variant="contained" color="primary">2h</Button>
            </Box>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                    label="Date"
                    format="dd.MM.yyyy"
                    value={date}
                    onChange={(newDate) => setDate(newDate)}
                    slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
                />
            </LocalizationProvider>
            <FormControl fullWidth margin="normal">
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                    label="Catego"
                    labelId="category-label"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                >
                    {categories.map((cat: Category) => (
                        <MenuItem
                            key={cat._id}
                            value={cat._id}
                        >
                            <Box display="flex" alignItems="center">
                                <Box
                                    component="span"
                                    sx={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: '50%',
                                        backgroundColor: cat.color,
                                        display: 'inline-block',
                                        marginRight: 1
                                    }}
                                />
                                {cat.name}
                            </Box>
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                Add Task
            </Button>
        </Box>
    );
};

export default TaskForm;
