import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser, UserRegistrationData, UserLoginData } from '../types/user';
import { mockDatabase } from '../services/mockDatabase';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (loginData: UserLoginData) => Promise<void>;
  register: (registrationData: UserRegistrationData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // 初期化時にローカルストレージから認証状態を復元
  useEffect(() => {
    const currentUser = mockDatabase.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  // ログイン処理
  const login = async (loginData: UserLoginData): Promise<void> => {
    try {
      setLoading(true);
      const authUser = await mockDatabase.loginUser(loginData);
      mockDatabase.saveCurrentUser(authUser);
      setUser(authUser);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 会員登録処理
  const register = async (registrationData: UserRegistrationData): Promise<void> => {
    try {
      setLoading(true);
      const authUser = await mockDatabase.registerUser(registrationData);
      mockDatabase.saveCurrentUser(authUser);
      setUser(authUser);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ログアウト処理
  const logout = (): void => {
    mockDatabase.logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// AuthContextを使用するためのカスタムフック
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
