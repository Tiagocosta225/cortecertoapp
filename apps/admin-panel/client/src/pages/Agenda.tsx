import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CalendarDays, Clock3, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";

const dayColumns = [
  {
    day: "Hoje",
    date: "18 Mar",
    occupancy: "85% ocupado",
    slots: [
      { time: "09:30", service: "Corte + barba premium", client: "Rafael Moraes", revenue: "R$ 75", tag: "Pix confirmado" },
      { time: "11:10", service: "Corte assinatura", client: "Carlos Neri", revenue: "R$ 45", tag: "Reativado" },
      { time: "14:40", service: "Slot premium livre", client: "Sugerir encaixe", revenue: "+R$ 75", tag: "Melhor horario" },
      { time: "17:20", service: "Corte + barba premium", client: "Mateus Prado", revenue: "R$ 75", tag: "Upsell aberto" },
    ],
  },
  {
    day: "Amanha",
    date: "19 Mar",
    occupancy: "62% ocupado",
    slots: [
      { time: "10:00", service: "Corte assinatura", client: "Igor Freitas", revenue: "R$ 45", tag: "Confirmar WhatsApp" },
      { time: "13:30", service: "Janela ociosa", client: "Acionar clientes sumidos", revenue: "+R$ 45", tag: "CRM" },
      { time: "16:10", service: "Combo premium", client: "Leandro Paixao", revenue: "R$ 75", tag: "Reserva pendente" },
    ],
  },
];

export default function Agenda() {
  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 md:p-6">
        <section className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <Badge variant="outline" className="rounded-full border-[#b84f1f]/20 bg-white/70 text-[#b84f1f]">
              Agenda inteligente
            </Badge>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#1f1813] md:text-5xl">
              Horario vazio nao fica invisivel.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6b5a4d] md:text-base">
              O painel prioriza encaixes, reserva protegida e slots com maior potencial de faturamento.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="rounded-2xl border-black/8 bg-white/72">
              <MessageCircle className="mr-2 h-4 w-4" />
              Preencher horario ocioso
            </Button>
            <Button className="rounded-2xl bg-[linear-gradient(135deg,#d46a30,#b84f1f)] text-white">
              <Sparkles className="mr-2 h-4 w-4" />
              Gerar sugestoes do dia
            </Button>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <Card className="border-black/8 bg-[rgba(255,250,244,0.82)] p-5">
            <p className="text-sm text-[#6b5a4d]">Receita prevista hoje</p>
            <p className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-[#1f1813]">R$ 1.180</p>
            <p className="mt-2 text-sm text-[#8a7362]">Se o slot das 14:40 fechar, sobe para R$ 1.255.</p>
          </Card>
          <Card className="border-black/8 bg-[rgba(255,250,244,0.82)] p-5">
            <p className="text-sm text-[#6b5a4d]">Protecao anti-furo</p>
            <p className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-[#1f1813]">12 reservas</p>
            <p className="mt-2 text-sm text-[#8a7362]">Pix ativado nos horarios de maior procura.</p>
          </Card>
          <Card className="border-black/8 bg-[rgba(255,250,244,0.82)] p-5">
            <p className="text-sm text-[#6b5a4d]">Proxima acao</p>
            <p className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-[#1f1813]">13:30</p>
            <p className="mt-2 text-sm text-[#8a7362]">Disparar reativacao para preencher a janela de baixa.</p>
          </Card>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
          <div className="grid gap-4 md:grid-cols-2">
            {dayColumns.map((column) => (
              <Card key={column.day} className="border-black/8 bg-[rgba(255,250,244,0.82)] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.16em] text-[#8a7362]">{column.day}</p>
                    <h2 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-[#1f1813]">{column.date}</h2>
                  </div>
                  <Badge className="rounded-full bg-[#24423a]/10 text-[#24423a] hover:bg-[#24423a]/10">
                    {column.occupancy}
                  </Badge>
                </div>

                <div className="mt-5 space-y-3">
                  {column.slots.map((slot) => (
                    <div key={`${column.day}-${slot.time}`} className="rounded-3xl border border-black/8 bg-white/72 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="flex items-center gap-2 text-sm text-[#8a7362]">
                            <Clock3 className="h-4 w-4" />
                            {slot.time}
                          </p>
                          <p className="mt-2 font-semibold text-[#1f1813]">{slot.service}</p>
                          <p className="mt-1 text-sm text-[#6b5a4d]">{slot.client}</p>
                        </div>
                        <Badge variant="outline" className="rounded-full border-[#b84f1f]/20 bg-[#b84f1f]/6 text-[#b84f1f]">
                          {slot.tag}
                        </Badge>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm text-[#8a7362]">Receita prevista</span>
                        <strong className="text-lg text-[#1f1813]">{slot.revenue}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          <Card className="border-black/8 bg-[#1d1714] p-5 text-[#f7ede3]">
            <div className="space-y-4">
              <div>
                <p className="text-sm uppercase tracking-[0.16em] text-[#bca694]">Regras da agenda</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">Como o sistema decide</h2>
              </div>

              <div className="rounded-3xl bg-white/6 p-4">
                <p className="flex items-center gap-2 text-sm text-[#f7ede3]">
                  <ShieldCheck className="h-4 w-4" />
                  Horarios premium exigem taxa de reserva
                </p>
              </div>
              <div className="rounded-3xl bg-white/6 p-4">
                <p className="flex items-center gap-2 text-sm text-[#f7ede3]">
                  <CalendarDays className="h-4 w-4" />
                  Quinta com baixa ocupacao dispara CRM automatico
                </p>
              </div>
              <div className="rounded-3xl bg-white/6 p-4">
                <p className="flex items-center gap-2 text-sm text-[#f7ede3]">
                  <Sparkles className="h-4 w-4" />
                  Slots livres recebem sugestao de servico com ticket maior
                </p>
              </div>

              <Button className="w-full rounded-2xl bg-[linear-gradient(135deg,#d46a30,#b84f1f)] text-white">
                Aplicar automacoes agora
              </Button>
            </div>
          </Card>
        </section>
      </div>
    </DashboardLayout>
  );
}
