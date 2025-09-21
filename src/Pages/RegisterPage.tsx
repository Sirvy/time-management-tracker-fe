import React, { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Container, TextField, Typography } from '@mui/material';
import { useRegister } from '../api/data-hooks/useRegister';
import { useAuth } from '../Providers/AuthProvider';

interface ErrorData {
    message: string,
    status: number,
}

export const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const { mutate: handleRegister } = useRegister();
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/');
        }
    }, [isLoggedIn]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');

        handleRegister({ username, password, email }, {
            onSuccess: (data) => {
                navigate('/login', { state: { message: 'Registration successful! Please log in.' } });
            },
            onError: (error) => {
                const axiosError = error as AxiosError<ErrorData>;
                const errorData = axiosError.response?.data;
                if (errorData) {
                    setError(`Registration failed. ${errorData.message}`);
                } else {
                    setError('Registration failed. Please try again.');
                }
            }
        });
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" component="h1" gutterBottom>
                Register Page
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    autoFocus
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Register
                </Button>
            </Box>
        </Container>
    );
};
