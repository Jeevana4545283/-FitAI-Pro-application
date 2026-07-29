import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  isLoading: boolean;
  login: (email?: string, password?: string) => Promise<void>;
  googleLogin: () => Promise<void>;
  quickGuestLogin: () => Promise<void>;
  register: (name?: string, email?: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('fitaix_token');
    const storedUser = localStorage.getItem('fitaix_user');
    const storedOnboarding = localStorage.getItem('fitaix_profile_completed');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setHasCompletedOnboarding(storedOnboarding === 'true');
      } catch (e) {
        localStorage.removeItem('fitaix_token');
        localStorage.removeItem('fitaix_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email?: string, password?: string) => {
    const finalEmail = email || "athlete@fitaix.com";
    const finalPassword = password || "password123";
    let userData: User;
    let jwtToken = 'mock-jwt-token-2026';

    try {
      const response = await api.post('/auth/login', { email: finalEmail, password: finalPassword });
      jwtToken = response.data.token || jwtToken;
      const { id, name } = response.data;
      userData = { id: id || 'usr-1', name: name || 'Athlete', email: finalEmail };
    } catch (error: any) {
      const userName = finalEmail.split('@')[0] || 'Athlete';
      userData = {
        id: 'usr-1',
        name: userName.charAt(0).toUpperCase() + userName.slice(1),
        email: finalEmail,
      };
    }

    localStorage.setItem('fitaix_token', jwtToken);
    localStorage.setItem('fitaix_user', JSON.stringify(userData));
    localStorage.setItem('fitaix_profile_completed', 'true');

    setToken(jwtToken);
    setUser(userData);
    setHasCompletedOnboarding(true);
  };

  const quickGuestLogin = async () => {
    const guestUser: User = {
      id: 'usr-guest-101',
      name: 'Athlete',
      email: 'athlete@fitaix.com',
    };
    const mockToken = 'mock-guest-jwt-token-2026';

    localStorage.setItem('fitaix_token', mockToken);
    localStorage.setItem('fitaix_user', JSON.stringify(guestUser));
    localStorage.setItem('fitaix_profile_completed', 'true');

    setToken(mockToken);
    setUser(guestUser);
    setHasCompletedOnboarding(true);
  };

  const googleLogin = async () => {
    const googleUser: User = {
      id: 'usr-google-101',
      name: 'Google Athlete',
      email: 'user.google@fitaix.com',
    };
    const mockToken = 'mock-google-jwt-token-2026';

    localStorage.setItem('fitaix_token', mockToken);
    localStorage.setItem('fitaix_user', JSON.stringify(googleUser));
    localStorage.setItem('fitaix_profile_completed', 'true');

    setToken(mockToken);
    setUser(googleUser);
    setHasCompletedOnboarding(true);
  };

  const register = async (name?: string, email?: string, password?: string) => {
    const finalName = name || "Athlete";
    const finalEmail = email || "athlete@fitaix.com";
    let userData: User = { id: 'usr-new', name: finalName, email: finalEmail };
    let jwtToken = 'mock-jwt-token-2026';

    try {
      const response = await api.post('/auth/register', { name: finalName, email: finalEmail, password: password || "password123" });
      jwtToken = response.data.token || jwtToken;
      userData.id = response.data.id || userData.id;
    } catch (error: any) {
      // Fallback
    }

    localStorage.setItem('fitaix_token', jwtToken);
    localStorage.setItem('fitaix_user', JSON.stringify(userData));
    localStorage.setItem('fitaix_profile_completed', 'true');

    setToken(jwtToken);
    setUser(userData);
    setHasCompletedOnboarding(true);
  };

  const completeOnboarding = () => {
    localStorage.setItem('fitaix_profile_completed', 'true');
    setHasCompletedOnboarding(true);
  };

  const logout = async () => {
    try {
      if (token) {
        await api.post('/auth/logout', {}, { headers: { Authorization: `Bearer ${token}` } });
      }
    } catch (e) {
      // Ignore API errors on logout
    } finally {
      localStorage.removeItem('fitaix_token');
      localStorage.removeItem('fitaix_user');
      localStorage.removeItem('fitaix_profile_completed');
      localStorage.removeItem('fitaix_profile_data');
      localStorage.removeItem('fitaix_app_state');
      setToken(null);
      setUser(null);
      setHasCompletedOnboarding(false);
    }
  };

  const forgotPassword = async (email: string): Promise<void> => {
    return new Promise<void>((resolve) => setTimeout(resolve, 800));
  };

  const resetPassword = async (password: string): Promise<void> => {
    return new Promise<void>((resolve) => setTimeout(resolve, 800));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        hasCompletedOnboarding,
        isLoading,
        login,
        googleLogin,
        quickGuestLogin,
        register,
        logout,
        completeOnboarding,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
