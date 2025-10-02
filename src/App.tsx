import './App.css';
import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HomePage } from './Pages/HomePage';
import { TestPage } from './Pages/TestPage';
import { LoginPage } from './Pages/LoginPage';
import { ProfilePage } from './Pages/ProfilePage';
import { PrivateRoute } from './Routers/PrivateRoute';
import { RegisterPage } from './Pages/RegisterPage';
import MainLayout from './Layouts/MainLayout';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider, useAuth } from './Providers/AuthProvider';
import { NotFoundPage } from './Pages/NotFoundPage';

const queryClient = new QueryClient();

const App = () => {
    const { logout } = useAuth();

    useEffect(() => {
        function handleLogout() {
            logout();
        }

        window.addEventListener('logout', handleLogout);
        return () => window.removeEventListener('logout', handleLogout);
    }, [logout]);

    return (
        <BrowserRouter>
            <AuthProvider>
                <QueryClientProvider client={queryClient}>
                    <MainLayout>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/test" element={<TestPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/user" element={<PrivateRoute />}>
                                <Route path="/user/profile" element={<ProfilePage />} />
                            </Route>
                            <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                    </MainLayout>
                </QueryClientProvider>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;