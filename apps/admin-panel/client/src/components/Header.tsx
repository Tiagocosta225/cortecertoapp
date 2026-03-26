import { Bell, Link2, MessageCircle, Search, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function Header() {
  return (
    <header className="border-b border-black/8 bg-[rgba(255,250,244,0.78)] px-4 py-4 backdrop-blur md:px-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative max-w-xl flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8c7768]" />
            <Input
              placeholder="Buscar cliente, horario premium ou campanha..."
              className="h-11 rounded-2xl border-black/8 bg-white/70 pl-10"
            />
          </div>
          <Button variant="outline" className="hidden rounded-2xl border-black/8 bg-white/65 lg:inline-flex">
            <Link2 className="mr-2 h-4 w-4" />
            Copiar link publico
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Badge className="rounded-full bg-[rgba(36,66,58,0.12)] px-3 py-1 text-[#24423a] hover:bg-[rgba(36,66,58,0.12)]">
            <TrendingUp className="mr-1 h-3.5 w-3.5" />
            +18% na receita em 7 dias
          </Badge>
          <Button variant="outline" className="rounded-2xl border-black/8 bg-white/65">
            <MessageCircle className="mr-2 h-4 w-4" />
            Chamar clientes sumidos
          </Button>
          <Button variant="ghost" size="icon" className="rounded-2xl text-[#5c4a3d]">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
