"use client";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { api, User } from "@/lib/api";
const theme = createTheme({
  palette: { primary: { main: "#137d6b" }, secondary: { main: "#071b24" } },
  typography: { fontFamily: "Arial, Helvetica, sans-serif" },
  shape: { borderRadius: 10 },
});
const AuthContext = createContext<{
  user: User | null;
  loading: boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
}>({
  user: null,
  loading: true,
  refresh: async () => {},
  signOut: async () => {},
});
export const useAuth = () => useContext(AuthContext);
export function Providers({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const refresh = useCallback(async () => {
    try {
      setUser(await api<User>("/auth/profile"));
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    let active = true;
    api<User>("/auth/profile")
      .then((data) => {
        if (active) setUser(data);
      })
      .catch(() => {
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);
  async function signOut() {
    await api("/auth/signout", { method: "POST" });
    setUser(null);
  }
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <AuthContext.Provider value={{ user, loading, refresh, signOut }}>
          {children}
        </AuthContext.Provider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
