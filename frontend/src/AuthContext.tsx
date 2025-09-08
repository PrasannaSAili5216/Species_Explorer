import React, { createContext, useState, ReactNode } from 'react';

interface AuthContextType {
    token: string | null;
    setToken: (token: string | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    const handleSetToken = (token: string | null) => {
        setToken(token);
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    };

    return (
        <AuthContext.Provider value={{ token, setToken: handleSetToken }}>
            {children}
        </AuthContext.Provider>
    );
};