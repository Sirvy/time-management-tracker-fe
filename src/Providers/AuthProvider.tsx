// ThemeContext.js
import React, { createContext, useContext, useState } from 'react';
import { removeTokens } from '../Services/AuthService';

interface AuthContextType {
    isLoggedIn: boolean;
    logout: () => void;
    setAuth: (auth: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
    isLoggedIn: false,
    logout: () => {
        console.warn('logout function not implemented');
    },
    setAuth: (auth: boolean) => {
        console.warn('setAuth function not implemented');
    }
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const setAuth = (auth: boolean) => {
        setIsLoggedIn(auth);
    };

    const logout = () => {
        setIsLoggedIn(false);
        removeTokens();
        console.log('Logout called');
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, logout, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};