import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { AuthUser, loadSession, login, logout, register } from '@/lib/api';

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, senha: string) => Promise<void>;
  signUp: (data: { nome: string; email: string; telefone?: string; senha: string }) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    loadSession()
      .then((sessionUser) => {
        if (active) setUser(sessionUser);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    signIn: async (email, senha) => {
      const payload = await login(email, senha);
      setUser(payload.usuario);
    },
    signUp: async (data) => {
      const payload = await register(data);
      setUser(payload.usuario);
    },
    signOut: async () => {
      await logout();
      setUser(null);
    },
  }), [loading, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
