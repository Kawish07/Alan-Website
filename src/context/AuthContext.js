import React, { createContext, useState, useEffect } from 'react';
import API from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const adminToken = localStorage.getItem('adminToken');
            const userToken = localStorage.getItem('userToken');

            // Check admin token first
            if (adminToken) {
                API.defaults.headers.common['x-auth-token'] = adminToken;
                const stored = localStorage.getItem('adminData');
                const adminUser = stored ? JSON.parse(stored) : { role: 'admin' };
                setIsAuthenticated(true);
                setUser({ ...adminUser, role: 'admin' });
            }
            // Check user token
            else if (userToken) {
                API.defaults.headers.common['x-auth-token'] = userToken;
                try {
                    const res = await API.get('/users/me');
                    setIsAuthenticated(true);
                    setUser({ ...res.data, role: res.data.role || 'user' });
                    localStorage.setItem('userData', JSON.stringify(res.data));
                } catch {
                    localStorage.removeItem('userToken');
                    localStorage.removeItem('userData');
                    delete API.defaults.headers.common['x-auth-token'];
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    // Admin login — uses /auth/login (env-based credentials only)
    const adminLogin = async (email, password) => {
        try {
            const res = await API.post('/auth/login', { email, password });
            // Clear any existing user session
            localStorage.removeItem('userToken');
            localStorage.removeItem('userData');
            // Set admin session
            localStorage.setItem('adminToken', res.data.token);
            API.defaults.headers.common['x-auth-token'] = res.data.token;
            const adminUser = {
                id: res.data.user?.id || 'admin_001',
                name: res.data.user?.name || 'Administrator',
                email: res.data.user?.email || email,
                role: 'admin'
            };
            setUser(adminUser);
            setIsAuthenticated(true);
            localStorage.setItem('adminData', JSON.stringify(adminUser));
            return { success: true };
        } catch (err) {
            return { success: false, msg: err.response?.data?.msg || 'Invalid admin credentials' };
        }
    };

    // User login — uses /users/login (DB-based credentials only)
    const userLogin = async (email, password) => {
        try {
            const res = await API.post('/users/login', { email, password });
            // Clear any existing admin session
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminData');
            // Set user session
            localStorage.setItem('userToken', res.data.token);
            API.defaults.headers.common['x-auth-token'] = res.data.token;
            const userData = { ...res.data.user, role: res.data.user.role || 'user' };
            setUser(userData);
            setIsAuthenticated(true);
            localStorage.setItem('userData', JSON.stringify(userData));
            return { success: true };
        } catch (err) {
            return { success: false, msg: err.response?.data?.msg || 'Login failed' };
        }
    };

    // User register — uses /users/register
    const userRegister = async (name, email, password, phone) => {
        try {
            const res = await API.post('/users/register', { name, email, password, phone });
            // Clear any existing admin session
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminData');
            // Set user session
            localStorage.setItem('userToken', res.data.token);
            API.defaults.headers.common['x-auth-token'] = res.data.token;
            const userData = { ...res.data.user, role: res.data.user.role || 'user' };
            setUser(userData);
            setIsAuthenticated(true);
            localStorage.setItem('userData', JSON.stringify(userData));
            return { success: true };
        } catch (err) {
            return { success: false, msg: err.response?.data?.msg || 'Registration failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        // Also remove legacy key
        localStorage.removeItem('token');
        delete API.defaults.headers.common['x-auth-token'];
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, adminLogin, userLogin, userRegister, logout }}>
            {children}
        </AuthContext.Provider>
    );
};