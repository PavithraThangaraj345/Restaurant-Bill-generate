import { createContext, useContext, useState, useEffect } from 'react';
import api from '../axios'; // Use your configured axios instance

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user'); // Also remove the user object
        setIsAuthenticated(false);
        setUser(null);
    };

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // Correctly use the configured axios instance
                    const res = await api.get('/auth/me', {
                        headers: {
                            'Authorization': `Bearer ${token}` // Use 'Bearer' token format
                        }
                    });
                    setUser(res.data);
                    setIsAuthenticated(true);
                } catch (err) {
                    console.error("Failed to fetch user:", err);
                    logout();
                }
            }
            setLoading(false);
        };
        fetchUser();
    }, []);

    const login = (userData) => {
        localStorage.setItem("token", userData.token);
        // Store the full user object (excluding password)
        localStorage.setItem("user", JSON.stringify(userData.user)); 
        setUser(userData.user);
        setIsAuthenticated(true);
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        logout
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};