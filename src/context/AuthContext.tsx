"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import api from "@/lib/api"; 

// A more detailed and type-safe User interface
interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    date_joined: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    checkAuthStatus: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provides authentication state to its children components.
 * This provider should wrap the entire application.
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    /**
     * Fetches user data from the backend to verify authentication.
     * This function is the single source of truth for the user's auth status.
     * It relies on the browser sending the HttpOnly cookie automatically.
     */
    const checkAuthStatus = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get("/accounts/me/");
            if (response.status === 200 && response.data) {
                setUser(response.data);
                setIsAuthenticated(true);
            } else {
                // Handle cases where API returns 200 but no data
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error("Authentication check failed:", error);
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // On initial component mount, check if the user is already logged in.
    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);

    /**
     * Logs the user out by making a request to the backend's logout endpoint.
     * The backend is responsible for clearing the HttpOnly cookies.
     */
    const logout = async () => {
        try {
            // Assuming your backend has a '/accounts/logout/' endpoint
            // that invalidates the refresh token and clears the cookies.
            await api.post("/accounts/logout/");
        } catch (error) {
            console.error("Logout failed:", error);
            // Even if the backend call fails, force a client-side logout
            // to ensure the user is redirected and state is cleared.
        } finally {
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    const contextValue = {
        user,
        isAuthenticated,
        isLoading,
        checkAuthStatus, // Renamed from 'login' for clarity
        logout,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Custom hook to consume the AuthContext.
 * Ensures the hook is used within a component wrapped by AuthProvider.
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};