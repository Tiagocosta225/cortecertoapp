import { Link, useLocation } from "wouter";
import { BarChart3, Calendar, Crown, Sparkles, Users, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Motor de receita", icon: Wallet },
    { href: "/agenda", label: "Agenda inteligente", icon: Calendar },
    { href: "/clientes", label: "Clientes e CRM", icon: Users },
    { href: "/servicos", label: "Oferta rentavel", icon: Crown },
    { href: "/configuracoes", label: "MVP → Escala", icon: Sparkles },
  ];

  return (
    <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-[linear-gradient(180deg,#1d1714_0%,#241d19_50%,#181311_100%)] text-[#f6ece1] lg:flex lg:flex-col">
      <div className="border-b border-white/10 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#d46a30,#b84f1f)] shadow-lg">
            <BarChart3 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#c6b29f]">CorteCertoApp</p>
            <h1 className="text-lg font-semibold">Faturamento da Barbearia</h1>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <a
                className={cn(
                  "flex items-start gap-3 rounded-2xl px-4 py-3 transition-all duration-200",
                  isActive
                    ? "bg-[linear-gradient(135deg,rgba(212,106,48,0.18),rgba(36,66,58,0.28))] text-white shadow-[0_18px_40px_rgba(0,0,0,0.18)]"
                    : "text-[#d8c4b1] hover:bg-white/6 hover:text-white"
                )}
              >
                <Icon className="mt-0.5 h-5 w-5 shrink-0" />
                <span className="leading-tight">
                  <span className="block font-medium">{item.label}</span>
                  <span className="text-xs text-[#b59f8b]">
                    {item.href === "/"
                      ? "Receita, anti-furo e reativacao"
                      : item.href === "/agenda"
                        ? "Encaixes e horarios mais rentaveis"
                        : item.href === "/clientes"
                          ? "Ranking, retorno e acao rapida"
                          : item.href === "/servicos"
                            ? "Pacotes, ancoragem e upsell"
                            : "Infra, automacao e crescimento"}
                  </span>
                </span>
              </a>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="rounded-3xl bg-white/6 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[#b59f8b]">Link ativo</p>
          <p className="mt-2 text-sm font-semibold">cortecerto.app/barbearia-do-joao</p>
          <p className="mt-2 text-sm text-[#cfbcaa]">Reserva com Pix ligada e CRM automatico pronto para disparo.</p>
        </div>
      </div>
    </aside>
  );
}
