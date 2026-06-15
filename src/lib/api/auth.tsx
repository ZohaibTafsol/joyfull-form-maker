import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api, tokenStore } from "./client";

type LoginResponse = {
  mfa_required: boolean;
  access_token?: string;
  refresh_token?: string;
  temp_token?: string;
  token_type?: string;
  expires_in?: number;
  message?: string;
};

type AuthState = {
  isAuthenticated: boolean;
  mfaPending: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ mfa_required: boolean }>;
  verifyMfa: (otp: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthCtx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setAuth] = useState(false);
  const [mfaPending, setMfaPending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAuth(!!tokenStore.getAccess());
    setMfaPending(!!tokenStore.getTemp() && !tokenStore.getAccess());
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const data = await api<LoginResponse>("/auth/login", { method: "POST", body: { email, password }, token: null });
    if (data.mfa_required) {
      tokenStore.setTemp(data.temp_token ?? null);
      setMfaPending(true);
      return { mfa_required: true };
    }
    tokenStore.setAccess(data.access_token ?? null);
    tokenStore.setRefresh(data.refresh_token ?? null);
    setAuth(true);
    setMfaPending(false);
    return { mfa_required: false };
  };

  const verifyMfa = async (otp: string) => {
    const temp = tokenStore.getTemp();
    const data = await api<LoginResponse>("/auth/mfa/verify", { method: "POST", body: { otp }, token: temp });
    tokenStore.setAccess(data.access_token ?? null);
    tokenStore.setRefresh(data.refresh_token ?? null);
    tokenStore.setTemp(null);
    setAuth(true);
    setMfaPending(false);
  };

  const logout = async () => {
    try { await api("/auth/logout", { method: "POST" }); } catch { /* ignore */ }
    tokenStore.clear();
    setAuth(false);
    setMfaPending(false);
  };

  return (
    <AuthCtx.Provider value={{ isAuthenticated, mfaPending, loading, login, verifyMfa, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}