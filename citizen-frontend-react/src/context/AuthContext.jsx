import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing auth on mount
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        console.log('AuthContext - Initializing:', {
            hasToken: !!storedToken,
            hasUser: !!storedUser,
            tokenPreview: storedToken ? storedToken.substring(0, 20) + '...' : 'none'
        });

        if (storedToken && storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setToken(storedToken);
                setUser(parsedUser);
                console.log('AuthContext - Restored session:', {
                    userId: parsedUser.id,
                    role: parsedUser.role,
                    name: parsedUser.name
                });
            } catch (error) {
                console.error('AuthContext - Error parsing stored user:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        } else {
            console.log('AuthContext - No stored session found');
        }
        setLoading(false);
    }, []);

    const login = (userData, authToken) => {
        console.log('AuthContext - Login:', {
            userId: userData.id,
            role: userData.role,
            name: userData.name
        });
        setUser(userData);
        setToken(authToken);
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        console.log('AuthContext - Logout');
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
    };

    const value = {
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!token,
        isCitizen: user?.role === 'citizen',
        isOfficer: user?.role === 'officer',
    };

    console.log('AuthContext - Current state:', {
        isAuthenticated: !!token,
        hasUser: !!user,
        role: user?.role,
        loading
    });

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
