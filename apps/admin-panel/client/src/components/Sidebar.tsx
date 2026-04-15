import { Link } from "wouter";
import { BarChart3, Calendar, Users, Settings, Scissors, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";
import logo from "@/assets/logo-cortecertoapp.png";

export function Sidebar() {
  const [location] = useLocation();

  async function handleLogout() {
    const token = window.localStorage.getItem("cortecerto.authToken");
    if (token) {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    window.localStorage.removeItem("cortecerto.authToken");
    window.localStorage.removeItem("cortecerto.authUser");
    window.location.reload();
  }

  const navItems = [
    { href: "/", label: "Dashboard", icon: BarChart3 },
    { href: "/agenda", label: "Agenda", icon: Calendar },
    { href: "/clientes", label: "Clientes", icon: Users },
    { href: "/servicos", label: "Serviços", icon: Scissors },
    { href: "/configuracoes", label: "Configurações", icon: Settings },
  ];

  return (
    <div className="w-64 bg-[linear-gradient(180deg,#0A0E27_0%,#101735_100%)] text-white flex flex-col border-r border-white/10">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex min-h-72 items-center justify-center">
          <img src={logo} alt="CorteCertoApp" className="max-h-72 max-w-full object-contain" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <a
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-[#0066FF] text-white shadow-lg"
                    : "text-slate-300 hover:bg-white/8 hover:text-white"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </a>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-300 hover:text-white hover:bg-white/8"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sair
        </Button>
      </div>
    </div>
  );
}
