import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import { useEffect, useMemo, useState } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Dashboard from "./pages/Dashboard";
import Agenda from "./pages/Agenda";
import Clientes from "./pages/Clientes";
import Servicos from "./pages/Servicos";
import Configuracoes from "./pages/Configuracoes";
import Login from "./pages/Login";

const AUTH_TOKEN_STORAGE_KEY = "cortecerto.authToken";
const AUTH_USER_STORAGE_KEY = "cortecerto.authUser";

declare global {
  interface Window {
    __cortecertoOriginalFetch?: typeof window.fetch;
    __cortecertoAuthenticatedFetchInstalled?: boolean;
  }
}

type AuthUser = {
  id: number;
  nome: string;
  email: string;
  telefone?: string | null;
  papel: string;
};

type AuthPayload = {
  token: string;
  expiresAt: string;
  usuario: AuthUser;
};


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Dashboard} />
      <Route path={"/agenda"} component={Agenda} />
      <Route path={"/clientes"} component={Clientes} />
      <Route path={"/servicos"} component={Servicos} />
      <Route path={"/configuracoes"} component={Configuracoes} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function installAuthenticatedFetch() {
  if (window.__cortecertoAuthenticatedFetchInstalled) {
    return;
  }

  const originalFetch = window.__cortecertoOriginalFetch || window.fetch.bind(window);
  window.__cortecertoOriginalFetch = originalFetch;

  window.fetch = (input: RequestInfo | URL, init: RequestInit = {}) => {
    const url = typeof input === "string"
      ? input
      : input instanceof URL
        ? input.toString()
        : input.url;
    const isApiRequest = url.startsWith("/api") || url.startsWith(window.location.origin + "/api");
    const isAuthRequest = url.includes("/api/auth/login") || url.includes("/api/auth/register");
    const token = window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

    if (!token || !isApiRequest || isAuthRequest) {
      return originalFetch(input, init);
    }

    const headers = new Headers(init.headers);
    if (!headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return originalFetch(input, { ...init, headers });
  };

  window.__cortecertoAuthenticatedFetchInstalled = true;
}

function AuthenticatedApp() {
  installAuthenticatedFetch();

  const [token, setToken] = useState(() => window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY));
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = window.localStorage.getItem(AUTH_USER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [checkingSession, setCheckingSession] = useState(Boolean(token));

  useEffect(() => {
    if (!token) {
      setCheckingSession(false);
      return;
    }

    let cancelled = false;

    async function loadSession() {
      try {
        const response = await fetch("/api/auth/me");
        if (!response.ok) throw new Error("Sessão inválida");
        const payload = await response.json();
        if (cancelled) return;
        setUser(payload.usuario);
        window.localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(payload.usuario));
      } catch {
        if (!cancelled) {
          window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
          window.localStorage.removeItem(AUTH_USER_STORAGE_KEY);
          setToken(null);
          setUser(null);
        }
      } finally {
        if (!cancelled) setCheckingSession(false);
      }
    }

    loadSession();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleAuthenticated = useMemo(
    () => (payload: AuthPayload) => {
      window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, payload.token);
      window.localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(payload.usuario));
      setToken(payload.token);
      setUser(payload.usuario);
    },
    []
  );

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">
        Carregando sessão...
      </div>
    );
  }

  if (!token || !user) {
    return <Login onAuthenticated={handleAuthenticated} />;
  }

  return <Router />;
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <AuthenticatedApp />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
