import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Crown, MessageCircle, Search, TrendingUp, Users } from "lucide-react";

const segments = [
  { label: "Mais gastam", value: "18 clientes", detail: "respondem por 41% da receita" },
  { label: "Mais voltam", value: "26 clientes", detail: "media de retorno em 16 dias" },
  { label: "Em risco", value: "9 clientes", detail: "passaram da janela ideal" },
];

const clients = [
  { name: "Rafael Moraes", tag: "VIP", visits: 18, spent: "R$ 1.820", returnWindow: "volta a cada 14 dias", action: "Ofertar combo premium" },
  { name: "Carlos Neri", tag: "Reativado", visits: 9, spent: "R$ 620", returnWindow: "voltou apos 24 dias", action: "Fixar recorrencia" },
  { name: "Mateus Prado", tag: "Upsell", visits: 12, spent: "R$ 1.040", returnWindow: "aceita upgrade no caixa", action: "Empurrar plano mensal" },
  { name: "Lucas Vale", tag: "Sumido", visits: 7, spent: "R$ 390", returnWindow: "22 dias sem vir", action: "Disparar WhatsApp" },
];

export default function Clientes() {
  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 md:p-6">
        <section className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <Badge variant="outline" className="rounded-full border-[#b84f1f]/20 bg-white/70 text-[#b84f1f]">
              CRM simples e acionavel
            </Badge>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#1f1813] md:text-5xl">
              Quem mais volta e quem precisa ser puxado de volta.
            </h1>
          </div>
          <Button className="rounded-2xl bg-[linear-gradient(135deg,#d46a30,#b84f1f)] text-white">
            <MessageCircle className="mr-2 h-4 w-4" />
            Chamar cliente que sumiu
          </Button>
        </section>

        <Card className="border-black/8 bg-[rgba(255,250,244,0.82)] p-4">
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a7362]" />
              <Input
                placeholder="Buscar por nome, WhatsApp ou comportamento de retorno..."
                className="h-11 rounded-2xl border-black/8 bg-white/72 pl-10"
              />
            </div>
            <Button variant="outline" className="rounded-2xl border-black/8 bg-white/72">
              <Users className="mr-2 h-4 w-4" />
              Segmentos automaticos
            </Button>
          </div>
        </Card>

        <section className="grid gap-4 md:grid-cols-3">
          {segments.map((segment) => (
            <Card key={segment.label} className="border-black/8 bg-[rgba(255,250,244,0.82)] p-5">
              <p className="text-sm text-[#6b5a4d]">{segment.label}</p>
              <p className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-[#1f1813]">{segment.value}</p>
              <p className="mt-2 text-sm text-[#8a7362]">{segment.detail}</p>
            </Card>
          ))}
        </section>

        <Card className="border-black/8 bg-[rgba(255,250,244,0.82)] p-6">
          <div className="space-y-4">
            {clients.map((client) => (
              <div
                key={client.name}
                className="grid gap-4 rounded-[1.6rem] border border-black/8 bg-white/72 p-4 xl:grid-cols-[1.2fr_0.8fr_0.6fr_0.8fr_auto]"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <p className="font-semibold text-[#1f1813]">{client.name}</p>
                    <Badge className="rounded-full bg-[#24423a]/10 text-[#24423a] hover:bg-[#24423a]/10">
                      {client.tag === "VIP" ? <Crown className="mr-1 h-3.5 w-3.5" /> : null}
                      {client.tag}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-[#6b5a4d]">{client.returnWindow}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-[#8a7362]">Visitas</p>
                  <p className="mt-2 text-lg font-semibold text-[#1f1813]">{client.visits}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-[#8a7362]">Total gasto</p>
                  <p className="mt-2 text-lg font-semibold text-[#1f1813]">{client.spent}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-[#8a7362]">Proxima acao</p>
                  <p className="mt-2 text-sm text-[#6b5a4d]">{client.action}</p>
                </div>
                <div className="flex items-center">
                  <Button variant="outline" className="rounded-2xl border-black/8 bg-white">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Acionar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
