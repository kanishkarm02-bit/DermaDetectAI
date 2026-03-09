import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  name: string;
  city?: string;
  avatar?: string;
  settings: {
    notifications: boolean;
    notificationTime: string;
    theme: 'dark' | 'light';
    dataSaver: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  login: (name: string, city: string) => void;
  logout: () => void;
  updateSettings: (settings: Partial<User['settings']>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('derma_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }
  }, []);

  const login = (name: string, city: string) => {
    const newUser: User = {
      name,
      city,
      settings: {
        notifications: false,
        notificationTime: '09:00',
        theme: 'dark',
        dataSaver: false,
      }
    };
    setUser(newUser);
    localStorage.setItem('derma_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('derma_user');
  };

  const updateSettings = (newSettings: Partial<User['settings']>) => {
    if (user) {
      const updatedUser = {
        ...user,
        settings: { ...user.settings, ...newSettings }
      };
      setUser(updatedUser);
      localStorage.setItem('derma_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateSettings, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
