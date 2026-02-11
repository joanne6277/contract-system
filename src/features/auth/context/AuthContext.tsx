import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';

import { sampleUsers } from '../data/mockUsers';

interface AuthContextType {
    isLoggedIn: boolean;
    currentUser: User | null;
    login: (employeeId: string, password: string) => Promise<User | null>;
    logout: () => void;
    users: User[]; // Exposing users for management (simulating DB)
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    updateUser: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>(sampleUsers);

    // Simulate session check (optional)
    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                setCurrentUser(user);
                setIsLoggedIn(true);
            } catch (e) {
                console.error("Failed to parse stored user", e);
                localStorage.removeItem('currentUser');
            }
        }
    }, []);

    const login = async (employeeId: string, password: string): Promise<User | null> => {
        // In a real app, this would be an API call
        // Check both state users and imported sampleUsers (to handle HMR updates in dev)
        const user = users.find(u => u.employeeId === employeeId && u.password === password)
            || sampleUsers.find(u => u.employeeId === employeeId && u.password === password);
        if (user) {
            setCurrentUser(user);
            setIsLoggedIn(true);
            localStorage.setItem('currentUser', JSON.stringify(user));
            return user;
        }
        return null;
    };

    const logout = () => {
        setIsLoggedIn(false);
        setCurrentUser(null);
        localStorage.removeItem('currentUser');
    };

    const updateUser = (updatedUser: User) => {
        setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
        // Update current user if it's the one being updated
        if (currentUser && currentUser.id === updatedUser.id) {
            setCurrentUser(updatedUser);
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        }
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, currentUser, login, logout, users, setUsers, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
