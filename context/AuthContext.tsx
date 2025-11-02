// src/context/AuthContext.tsx
import { authService } from '@/services/auth.service';
import type { User } from '@/types/user.types';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: any) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const result = await authService.getCurrentUser();
    if (result.success && result.data) {
      setUser(result.data);
    }
    setLoading(false); // Add this line
  }, []); // Add empty dependency array

  const checkUser = useCallback(async () => {
    try {
      const { data: session } = await authService.getSession();
      if (session) {
        await loadUser();
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  }, [loadUser]);

  useEffect(() => {
    // Check for existing session
    checkUser();

    // Listen for auth changes
    const { data: authListener } = authService.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          await loadUser();
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [checkUser, loadUser]);

  const signIn = async (email: string, password: string) => {
    const result = await authService.signIn({ email, password });
    if (result.success && result.data) {
      setUser(result.data);
    } else {
      throw new Error(result.error);
    }
  };

  const signUp = async (data: any) => {
    const result = await authService.register(data);
    if (result.success && result.data) {
      setUser(result.data);
    } else {
      throw new Error(result.error);
    }
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
  };

  const refreshUser = async () => {
    await loadUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        refreshUser,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
