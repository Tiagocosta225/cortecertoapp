import logo from "@/assets/logo-cortecertoapp.png";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Scissors } from "lucide-react";
import { useState } from "react";

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

type LoginProps = {
  onAuthenticated: (payload: AuthPayload) => void;
};

async function parseResponse(response: Response) {
  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    throw new Error(payload?.message || payload?.error || "Não foi possível autenticar.");
  }

  return payload as AuthPayload;
}

export default function Login({ onAuthenticated }: LoginProps) {
  const [loginForm, setLoginForm] = useState({ email: "", senha: "" });
  const [registerForm, setRegisterForm] = useState({ nome: "", email: "", telefone: "", senha: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      onAuthenticated(await parseResponse(response));
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Falha ao entrar.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerForm),
      });
      onAuthenticated(await parseResponse(response));
    } catch (registerError) {
      setError(registerError instanceof Error ? registerError.message : "Falha ao cadastrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <img src={logo} alt="CorteCertoApp" className="mx-auto h-56 w-auto object-contain" />
          <h1 className="mt-5 text-3xl font-bold text-slate-900">CorteCertoApp</h1>
          <p className="mt-2 text-sm text-slate-600">Acesse o painel administrativo com dados reais.</p>
        </div>

        <Card className="p-6 shadow-xl shadow-blue-100/60">
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="register">Cadastrar</TabsTrigger>
            </TabsList>

            {error && (
              <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <TabsContent value="login" className="mt-5">
              <form className="space-y-4" onSubmit={handleLogin}>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={loginForm.email}
                    onChange={(event) => setLoginForm((current) => ({ ...current, email: event.target.value }))}
                    placeholder="voce@email.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Senha</Label>
                  <Input
                    type="password"
                    value={loginForm.senha}
                    onChange={(event) => setLoginForm((current) => ({ ...current, senha: event.target.value }))}
                    placeholder="Sua senha"
                    required
                  />
                </div>
                <Button type="submit" className="h-12 w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                  {loading ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="mt-5">
              <form className="space-y-4" onSubmit={handleRegister}>
                <div className="space-y-2">
                  <Label>Nome</Label>
                  <Input
                    value={registerForm.nome}
                    onChange={(event) => setRegisterForm((current) => ({ ...current, nome: event.target.value }))}
                    placeholder="Seu nome"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email real</Label>
                  <Input
                    type="email"
                    value={registerForm.email}
                    onChange={(event) => setRegisterForm((current) => ({ ...current, email: event.target.value }))}
                    placeholder="voce@email.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input
                    value={registerForm.telefone}
                    onChange={(event) => setRegisterForm((current) => ({ ...current, telefone: event.target.value }))}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Senha</Label>
                  <Input
                    type="password"
                    value={registerForm.senha}
                    onChange={(event) => setRegisterForm((current) => ({ ...current, senha: event.target.value }))}
                    placeholder="Mínimo 6 caracteres"
                    required
                  />
                </div>
                <Button type="submit" className="h-12 w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                  <Scissors className="mr-2 h-4 w-4" />
                  {loading ? "Cadastrando..." : "Criar conta"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
