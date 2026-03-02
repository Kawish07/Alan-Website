import React, { createContext, useState, useEffect } from 'react';
import API from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            const userToken = localStorage.getItem('userToken');

            // Check admin token
            if (token) {
                API.defaults.headers.common['x-auth-token'] = token;
                setIsAuthenticated(true);
                setUser({ role: 'admin' });
            }
            // Check user token
            else if (userToken) {
                API.defaults.headers.common['x-auth-token'] = userToken;
                try {
                    const res = await API.get('/users/me');
                    setIsAuthenticated(true);
                    setUser({ ...res.data, role: res.data.role || 'user' });
                } catch {
                    localStorage.removeItem('userToken');
                    delete API.defaults.headers.common['x-auth-token'];
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    // Admin login
    const login = async (email, password) => {
        try {
            const res = await API.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            API.defaults.headers.common['x-auth-token'] = res.data.token;
            setIsAuthenticated(true);
            const adminUser = { 
                id: res.data.user?.id || 'admin_001', 
                name: res.data.user?.name || 'Administrator',
                email: res.data.user?.email || email,
                role: 'admin' 
            };
            setUser(adminUser);
            localStorage.setItem('userData', JSON.stringify(adminUser));
            return true;
        } catch (err) {
            console.error(err.response?.data);
            return false;
        }
    };

    // User login
    const userLogin = async (email, password) => {
        try {
            const res = await API.post('/users/login', { email, password });
            localStorage.setItem('userToken', res.data.token);
            API.defaults.headers.common['x-auth-token'] = res.data.token;
            setIsAuthenticated(true);
            setUser({ ...res.data.user, role: res.data.user.role || 'user' });
            return { success: true };
        } catch (err) {
            return { success: false, msg: err.response?.data?.msg || 'Login failed' };
        }
    };

    // User register
    const userRegister = async (name, email, password, phone) => {
        try {
            const res = await API.post('/users/register', { name, email, password, phone });
            localStorage.setItem('userToken', res.data.token);
            API.defaults.headers.common['x-auth-token'] = res.data.token;
            setIsAuthenticated(true);
            setUser({ ...res.data.user, role: res.data.user.role || 'user' });
            return { success: true };
        } catch (err) {
            return { success: false, msg: err.response?.data?.msg || 'Registration failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userToken');
        delete API.defaults.headers.common['x-auth-token'];
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, login, userLogin, userRegister, logout }}>
            {children}
        </AuthContext.Provider>
    );
};