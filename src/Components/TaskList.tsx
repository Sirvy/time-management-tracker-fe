import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import {
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    isWithinInterval,
    startOfMonth,
    startOfWeek
} from 'date-fns';
import { formatTimeFromSeconds } from '../Utils/Utils';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { PieChart } from 'react-minimal-pie-chart';
import { TaskModal } from './TaskModal';
import { Category, Task } from '../Interface/interface';
import { useCategories } from '../hooks/useCategories';

interface TaskListProps {
    tasks: Task[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
    const [startDate, setStartDate] = useState<Date>(startOfWeek(new Date()));
    const [endDate, setEndDate] = useState<Date>(endOfWeek(new Date()));
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
    const [daysInPeriod, setDaysInPeriod] = useState<Date[]>([]);
    const [modalTask, setModalTask] = useState<Task | null>(null);
    const { categories } = useCategories();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    useEffect(() => {
        handleThisWeek();
    }, []);

    useEffect(() => {
        const daysInterval = eachDayOfInterval({ start: startDate, end: endDate });
        setDaysInPeriod(daysInterval);

        const filtered = tasks.filter(task =>
            isWithinInterval(new Date(task.date), { start: startDate, end: endDate })
        );

        setFilteredTasks(filtered);
    }, [tasks, startDate, endDate]);

    const handleThisWeek = () => {
        const today = new Date();
        setStartDate(startOfWeek(today, { weekStartsOn: 1 }));
        setEndDate(endOfWeek(today, { weekStartsOn: 1 }));
    };

    const handlePreviousWeek = () => {
        setStartDate(new Date(startDate.setDate(startDate.getDate() - 7)));
        setEndDate(new Date(endDate.setDate(endDate.getDate() - 7)));
    };

    const handleNextWeek = () => {
        setStartDate(new Date(startDate.setDate(startDate.getDate() + 7)));
        setEndDate(new Date(endDate.setDate(endDate.getDate() + 7)));
    };

    const handleThisMonth = () => {
        const today = new Date();
        setStartDate(startOfMonth(today));
        setEndDate(endOfMonth(today));
    };

    const groupTasksByDay = () => {
        const grouped: { [key: string]: Task[] } = {};
        daysInPeriod.forEach(day => {
            const dateKey = format(day, 'yyyy-MM-dd');
            grouped[dateKey] = [];
        });
        filteredTasks.forEach(task => {
            const dateKey = format(new Date(task.date), 'yyyy-MM-dd');
            if (grouped[dateKey]) {
                grouped[dateKey].push(task);
            }
        });
        return grouped;
    };

    const getCategoryById = (categoryId: string): Category | undefined => {
        return categories.find((category: Category) => category._id === categoryId);
    };

    const getCategoryChartData = (tasksForDay: Task[]) => {
        const categoryTimes: { [key: string]: number } = {};
        tasksForDay.forEach(task => {
            const categoryKey = task.categoryId || '0';
            if (categoryTimes[categoryKey]) {
                categoryTimes[categoryKey] += task.timeSpent;
            } else {
                categoryTimes[categoryKey] = task.timeSpent;
            }
        });

        return Object.entries(categoryTimes).map(([categoryId, time]) => {
            const category = getCategoryById(categoryId);
            return {
                title: category?.name || 'Unknown',
                label: category?.name || 'Unknown',
                value: time,
                color: category?.color || '#000000'
            };
        });
    };

    const handleCategoryClick = (categoryId: string) => {
        setSelectedCategory(prevCategory => prevCategory === categoryId ? null : categoryId);
    };

    const getFilteredTasksByCategory = () => {
        if (!selectedCategory) return filteredTasks;
        return filteredTasks.filter(task => task.categoryId === selectedCategory);
    };

    const getCategoryProgressData = () => {
        const categoryTimes: { [key: string]: number } = {};
        let totalTime = 0;

        filteredTasks.forEach(task => {
            if (!selectedCategory || task.categoryId === selectedCategory) {
                const categoryKey = task.categoryId || '0';
                if (categoryTimes[categoryKey]) {
                    categoryTimes[categoryKey] += task.timeSpent;
                } else {
                    categoryTimes[categoryKey] = task.timeSpent;
                }
                totalTime += task.timeSpent;
            }
        });

        return Object.entries(categoryTimes).map(([categoryId, time]) => {
            const category = getCategoryById(categoryId);
            return {
                id: categoryId,
                name: category?.name || 'Unknown',
                percentage: (time / totalTime) * 100,
                totalHours: (time / 3600),
                color: category?.color || '#000000'
            };
        });
    };

    const calculateProductivityIndex = () => {
        if (filteredTasks.length === 0) {
            return { productivityIndex: 0, productivityNote: 'Do some work' };
        }
        const sleepTime = filteredTasks.reduce((sum, task) =>
            getCategoryById(task.categoryId)?.name === 'Sleep' ? sum + task.timeSpent : sum, 0);
        const leisureTime = filteredTasks.reduce((sum, task) =>
            ['Entertainment', 'Free time', 'Food', 'Other'].includes(getCategoryById(task.categoryId)?.name ?? '') ? sum + task.timeSpent : sum, 0);
        const productiveTime = filteredTasks.reduce((sum, task) =>
            ['Work', 'School/Study', 'Personal Projects', 'Exercise/Fitness', 'Personal development'].includes(getCategoryById(task.categoryId)?.name ?? '') ? sum + task.timeSpent : sum, 0);
        const totalHours = filteredTasks.reduce((sum, task) => sum + task.timeSpent, 0);

        const sleepPercentage = (sleepTime / totalHours) * 100;
        const leisurePercentage = (leisureTime / totalHours) * 100;
        const productivePercentage = (productiveTime / totalHours) * 100;

        const sleepDeviation = Math.abs(sleepPercentage - 33);
        const leisureDeviation = Math.abs(leisurePercentage - 33);
        const productiveDeviation = Math.abs(productivePercentage - 33);

        const productivityIndex = (100 - Math.round((sleepDeviation + leisureDeviation + productiveDeviation) / 3));

        let productivityNote = '';
        if (sleepPercentage < 30) productivityNote = 'Sleep more';
        else if (leisurePercentage < 30) productivityNote = 'Relax more';
        else if (productivePercentage < 30) productivityNote = 'Be more productive';
        else productivityNote = 'Perfectly balanced';

        return { productivityIndex, productivityNote };
    };

    const dateIsToday = (date: string) => {
        return date === new Date().toISOString().split('T')[0];
    };

    const showTaskModal = (task: Task) => {
        setModalTask(task);
    };

    const removeModalTask = () => {
        // TODO: Remove task modalTask
    };

    const groupedTasks = groupTasksByDay();
    const filteredTasksByCategory = getFilteredTasksByCategory();

    return (
        <Box>
            <TaskModal task={modalTask} onClose={() => setModalTask(null)} onDelete={() => {
                removeModalTask();
            }} onEdit={() => {
                console.log('Edit task');
            }} />
            <Typography variant="h6" gutterBottom>
                Task List
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    {/*
          <DatePicker
            label="Start Date"
            format="dd.MM.yyyy"
            value={startDate}
            onChange={(newDate) => newDate && setStartDate(newDate)}
          />
          <DatePicker
            label="End Date"
            format="dd.MM.yyyy"
            value={endDate}
            onChange={(newDate) => newDate && setEndDate(newDate)}
          /> */}
                    <Button variant="outlined" onClick={handlePreviousWeek}>Previous Week</Button>
                    <Button variant="outlined" onClick={handleThisWeek}>This Week</Button>
                    <Button variant="outlined" onClick={handleNextWeek}>Next Week</Button>
                </Box>
            </LocalizationProvider>
            <Box sx={{ overflowX: 'auto' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {Object.entries(groupedTasks).map(([date, tasksForDay]) => {
                                const filteredTasksForDay = tasksForDay.filter(task =>
                                    !selectedCategory || task.categoryId === selectedCategory
                                );
                                return (
                                    <TableCell key={date}
                                               style={{ backgroundColor: dateIsToday(date) ? 'rgba(100, 100, 255, 0.1)' : '#fff' }}>
                                        <Typography
                                            variant="subtitle1">{format(new Date(date), 'd.M.yyyy EEEE')}</Typography>
                                        <Typography variant="body2">
                                            Total
                                            time: {formatTimeFromSeconds(filteredTasksForDay.reduce((sum, task) => sum + task.timeSpent, 0))}
                                        </Typography>
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            {Object.entries(groupedTasks).map(([date, tasksForDay]) => {
                                const filteredTasksForDay = tasksForDay.filter(task =>
                                    !selectedCategory || task.categoryId === selectedCategory
                                );
                                return (
                                    <TableCell key={date} sx={{ verticalAlign: 'top', minWidth: '200px' }}>
                                        {filteredTasksForDay.length === 0 ? (
                                            <Typography variant="body2">No tasks</Typography>
                                        ) : (
                                            <>
                                                {filteredTasksForDay.map((task, index) => (
                                                    <Card key={index} sx={{
                                                        mb: 1,
                                                        backgroundColor: `${getCategoryById(task.categoryId)?.color}40`
                                                    }} className={'task'} onClick={() => showTaskModal(task)}>
                                                        <CardContent>
                                                            <Typography variant="body1">{task.title}</Typography>
                                                            <Typography variant="body2">{task.description}</Typography>
                                                            <Typography variant="body2">Time
                                                                spent: {formatTimeFromSeconds(task.timeSpent)}</Typography>
                                                            <Typography
                                                                variant="body2">Category: {getCategoryById(task.categoryId)?.name}</Typography>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                                <Typography variant="body2" sx={{ mt: 2 }}>
                                                    Total tasks: {filteredTasksForDay.length}
                                                </Typography>
                                                <Box sx={{ height: 150, mt: 2 }}>
                                                    <PieChart
                                                        data={getCategoryChartData(filteredTasksForDay)}
                                                        lineWidth={20}
                                                        paddingAngle={2}
                                                        label={({ dataEntry }) => `${Math.round(dataEntry.percentage)}%`}
                                                        labelStyle={{ fontSize: '5px', fill: '#ffffff' }}
                                                    />
                                                </Box>
                                            </>
                                        )}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    </TableBody>
                </Table>
            </Box>
            <Box sx={{ mt: 4 }}>
                {selectedCategory && (
                    <Button
                        variant="outlined"
                        onClick={() => setSelectedCategory(null)}
                        sx={{ mb: 2 }}
                    >
                        Clear Category Filter
                    </Button>
                )}
                {getCategoryProgressData().map((category) => (
                    <Box
                        key={category.id}
                        sx={{
                            mb: 2,
                            cursor: 'pointer',
                            opacity: selectedCategory && selectedCategory !== category.id ? 0.5 : 1,
                            transition: 'opacity 0.3s'
                        }}
                        onClick={() => handleCategoryClick(category.id)}
                    >
                        <Typography variant="body2">{category.name}</Typography>
                        <LinearProgress
                            variant="determinate"
                            value={category.percentage}
                            sx={{
                                height: 10,
                                backgroundColor: `${category.color}40`,
                                '& .MuiLinearProgress-bar': {
                                    backgroundColor: category.color
                                }
                            }}
                        />
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                            {category.percentage.toFixed(2)}% (~{category.totalHours.toFixed(2)}h)
                        </Typography>
                    </Box>
                ))}
                <Typography variant="h6" sx={{ mt: 4 }}>
                    Productivity Index: {calculateProductivityIndex().productivityIndex}%
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                    Note: {calculateProductivityIndex().productivityNote}
                </Typography>
            </Box>
        </Box>
    );
};

export default TaskList;