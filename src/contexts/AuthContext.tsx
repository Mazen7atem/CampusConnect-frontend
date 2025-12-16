import React, { createContext, useContext, useState, useEffect } from 'react';

export type AdminRole = 'system_admin' | 'event_room_admin' | 'sports_admin';

interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  role: AdminRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permissions: AdminRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: Record<string, User & { password: string }> = {
  'admin': {
    id: '1',
    username: 'admin',
    password: 'admin123',
    email: 'admin@ejust.edu.eg',
    name: 'System Administrator',
    role: 'system_admin',
  },
  'events': {
    id: '2',
    username: 'events',
    password: 'events123',
    email: 'events@ejust.edu.eg',
    name: 'Events Manager',
    role: 'event_room_admin',
  },
  'sports': {
    id: '3',
    username: 'sports',
    password: 'sports123',
    email: 'sports@ejust.edu.eg',
    name: 'Sports Coordinator',
    role: 'sports_admin',
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockUser = mockUsers[username];
    if (mockUser && mockUser.password === password) {
      const { password: _, ...userWithoutPassword } = mockUser;
      setUser(userWithoutPassword);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const hasPermission = (permissions: AdminRole[]): boolean => {
    if (!user) return false;
    if (user.role === 'system_admin') return true; // System admin has all permissions
    return permissions.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
