import React, { useEffect, useState } from 'react';
import { Box, Button, Chip, IconButton, Modal, Typography } from '@mui/material';
import { Close as CloseIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { formatTimeFromSeconds } from '../Utils/Utils';
import { Category, Task } from '../Interface/interface';
import { useCategories } from '../hooks/useCategories';
import { useDeleteTask } from '../api/data-hooks/useTasks';
import { isTokenValid } from '../Services/AuthService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Providers/AuthProvider';

interface TaskModalProps {
    task: Task | null,
    onClose: () => void,
    onDelete: () => void,
    onEdit: () => void
}

export const TaskModal = (props: TaskModalProps) => {
    const [open, setOpen] = useState(props.task !== null);
    const { categories } = useCategories();
    const deleteTask = useDeleteTask();
    const navigate = useNavigate();
    const { setAuth } = useAuth();

    const handleClose = () => {
        props.onClose();
        setOpen(false);
    };

    useEffect(() => {
        setOpen(props.task !== null);
        console.log(props.task);
    }, [props.task]);

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: '6px',
        p: 4
    };

    const category = categories.find((value: Category) => value._id === props.task?.categoryId);

    const handleDelete = async () => {
        if (!isTokenValid()) {
            setAuth(false);
            navigate('/');
        }

        if (!window.confirm('Are you sure?') || !props.task || !props.task._id) {
            return;
        }

        deleteTask.mutate((props.task._id), {
            onSuccess: () => {
                setOpen(false);
            }
        });
    };

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={modalStyle}>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography id="task-title" variant="h6">
                            {props.task?.title}
                        </Typography>
                        <IconButton aria-label="close" onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {props.task?.date.toDateString()}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Chip label={category?.name} sx={{ backgroundColor: category?.color, color: '#fff' }} />
                        <Typography sx={{ mt: 2 }}>
                            Time Spent: {formatTimeFromSeconds(props.task?.timeSpent ?? 0)}
                        </Typography>
                    </Box>

                    <Typography id="task-description" sx={{ mt: 2 }}>
                        {props.task?.description}
                    </Typography>


                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                        <Button variant="outlined" startIcon={<EditIcon />} color="primary" disabled={true}>
                            Edit
                        </Button>
                        <Button variant="outlined" startIcon={<DeleteIcon />} color="error" onClick={handleDelete}>
                            Delete
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
};