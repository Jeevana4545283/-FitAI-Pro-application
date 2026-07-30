import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  userId: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (name: string, email: string, password?: string) => Promise<void>;
  logout: () => void;
  completeOnboarding: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedUserStr = localStorage.getItem('fitaix_user');
    const storedOnboarding = localStorage.getItem('fitaix_profile_completed');

    if (storedUserStr) {
      try {
        const parsedUser = JSON.parse(storedUserStr);
        if (parsedUser && parsedUser.userId) {
          setUser(parsedUser);
          setHasCompletedOnboarding(storedOnboarding === 'true');
        } else {
          localStorage.clear();
          setUser(null);
          setHasCompletedOnboarding(false);
        }
      } catch (e) {
        localStorage.clear();
        setUser(null);
        setHasCompletedOnboarding(false);
      }
    } else {
      localStorage.clear();
      setUser(null);
      setHasCompletedOnboarding(false);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password?: string) => {
    // Instant open login - no strict credentials validation
    const rawName = email.split('@')[0] || "Athlete";
    const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
    
    const userData: User = {
      userId: `usr-${Date.now()}`,
      name: formattedName,
      email: email.trim(),
    };

    // Save user info in localStorage
    localStorage.setItem('fitaix_user', JSON.stringify(userData));
    localStorage.setItem('fitaix_profile_completed', 'false');

    setUser(userData);
    setHasCompletedOnboarding(false);
  };

  const register = async (name: string, email: string, password?: string) => {
    const rawName = name.trim() || email.split('@')[0] || "Athlete";
    
    const userData: User = {
      userId: `usr-${Date.now()}`,
      name: rawName,
      email: email.trim(),
    };

    // Save user info in localStorage
    localStorage.setItem('fitaix_user', JSON.stringify(userData));
    localStorage.setItem('fitaix_profile_completed', 'false');

    setUser(userData);
    setHasCompletedOnboarding(false);
  };

  const completeOnboarding = () => {
    localStorage.setItem('fitaix_profile_completed', 'true');
    setHasCompletedOnboarding(true);
  };

  const logout = () => {
    // Clear all session & localStorage data completely
    localStorage.clear();
    setUser(null);
    setHasCompletedOnboarding(false);
  };

  const forgotPassword = async (email: string): Promise<void> => {
    return new Promise<void>((resolve) => setTimeout(resolve, 300));
  };

  const resetPassword = async (password: string): Promise<void> => {
    return new Promise<void>((resolve) => setTimeout(resolve, 300));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        hasCompletedOnboarding,
        isLoading,
        login,
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
