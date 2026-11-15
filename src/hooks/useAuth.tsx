import React, { createContext, useCallback, useContext, useState } from 'react';
import { Language } from '../types';

export const DEMO_ADMIN_CREDENTIALS = {
    username: 'admin',
    emailAlias: 'admin@milk.by',
    password: 'milk2026',
} as const;

export interface StaffUser {
    username: string;
    role: Record<Language, string>;
}

interface AuthContextValue {
    user: StaffUser | null;
    isAuthenticated: boolean;
    login: (identifier: string, password: string) => boolean;
    logout: () => void;
}

const STORAGE_AUTH_KEY = 'milk_world_staff_auth_v1';

const DEFAULT_STAFF_USER: StaffUser = {
    username: DEMO_ADMIN_CREDENTIALS.username,
    role: {
        ru: 'Администратор сайта',
        be: 'Адміністратар сайта',
        en: 'Site Administrator',
        zh: '网站管理员',
    },
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function loadAuthSession(): StaffUser | null {
    try {
        const raw = localStorage.getItem(STORAGE_AUTH_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as { username?: string };
        if (parsed?.username === DEMO_ADMIN_CREDENTIALS.username) {
            return DEFAULT_STAFF_USER;
        }
    } catch {
        // ignore storage errors
    }
    return null;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<StaffUser | null>(() => loadAuthSession());

    const login = useCallback((identifier: string, password: string): boolean => {
        const normalized = identifier.trim().toLowerCase();
        const isValidUser =
        normalized === DEMO_ADMIN_CREDENTIALS.username ||
        normalized === DEMO_ADMIN_CREDENTIALS.emailAlias;
        const isValidPassword = password === DEMO_ADMIN_CREDENTIALS.password;

        if (!isValidUser || !isValidPassword) {
            return false;
        }

        setUser(DEFAULT_STAFF_USER);
        try {
            localStorage.setItem(
                STORAGE_AUTH_KEY,
                JSON.stringify({ username: DEFAULT_STAFF_USER.username })
            );
        } catch {
            // ignore storage errors
        }
        return true;
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        try {
            localStorage.removeItem(STORAGE_AUTH_KEY);
        } catch {
            // ignore storage errors
        }
    }, []);

    return (
        <AuthContext.Provider
        value={{
            user,
            isAuthenticated: Boolean(user),
            login,
            logout,
        }}
        >
        {children}
        </AuthContext.Provider>
    );
};

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return ctx;
}
