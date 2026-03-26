import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, CalendarRange, Crown, MessageCircle, ShieldCheck, Wallet } from "lucide-react";

const revenueStats = [
  { title: "Faturamento semanal", value: "R$ 6.840", detail: "+18% vs semana passada", tone: "bg-[#24423a]/10 text-[#24423a]", icon: Wallet },
  { title: "Reservas protegidas", value: "31", detail: "Pix ou taxa anti-furo ativa", tone: "bg-[#b84f1f]/10 text-[#b84f1f]", icon: ShieldCheck },
  { title: "Clientes reativados", value: "14", detail: "voltaram apos fluxo automatico", tone: "bg-[#d18b47]/14 text-[#9a6328]", icon: MessageCircle },
  { title: "Ticket premium", value: "R$ 68", detail: "combos lideram na sexta e sabado", tone: "bg-[#4d4038]/10 text-[#4d4038]", icon: Crown },
];

const opportunities = [
  {
    title: "Encaixe premium hoje as 14:40",
    description: "Horario com historico forte para corte + barba premium. Sugestao: cobrar reserva de R$ 15.",
    badge: "Maior chance de receita",
  },
  {
    title: "7 clientes passaram de 20 dias sem voltar",
    description: "Dispare o WhatsApp com oferta de retorno para preencher ociosidade de quinta.",
    badge: "CRM simples",
  },
  {
    title: "No-show caiu 61% neste mes",
    description: "Mantenha Pix antecipado apenas nos horarios de pico para equilibrar conversao e protecao.",
    badge: "Anti-furo",
  },
];

const recentRevenue = [
  { client: "Rafael Moraes", action: "Combo premium confirmado com Pix", amount: "R$ 75", eta: "09:30" },
  { client: "Carlos Neri", action: "Reativado apos 24 dias", amount: "R$ 45", eta: "11:10" },
  { client: "Henrique Luz", action: "Encaixe sugerido pelo sistema", amount: "R$ 75", eta: "14:40" },
  { client: "Mateus Prado", action: "Upgrade no caixa para hidratacao", amount: "R$ 95", eta: "17:20" },
];

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 md:p-6">
        <section className="grid gap-4 xl:grid-cols-[1.45fr_1fr]">
          <Card className="overflow-hidden border-black/8 bg-[linear-gradient(140deg,rgba(255,250,244,0.95),rgba(232,216,193,0.72))] p-6 shadow-[0_22px_60px_rgba(41,28,20,0.08)]">
            <div className="flex flex-col gap-5">
              <div className="space-y-3">
                <Badge variant="outline" className="rounded-full border-[#b84f1f]/20 bg-white/70 text-[#b84f1f]">
                  Motor de faturamento
                </Badge>
                <div className="space-y-2">
                  <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[#1f1813] md:text-5xl">
                    O painel existe para aumentar receita, nao para listar agenda.
                  </h1>
                  <p className="max-w-2xl text-sm leading-7 text-[#6b5a4d] md:text-base">
                    Hoje a operacao esta puxando horario premium, protegendo slots com Pix e chamando de volta quem
                    sumiu no melhor momento de retorno.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-3xl border border-black/8 bg-white/70 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-[#8a7362]">Hoje</p>
                  <p className="mt-2 text-2xl font-semibold text-[#1f1813]">18 reservas</p>
                  <p className="mt-2 text-sm text-[#6b5a4d]">12 confirmadas com pagamento antecipado</p>
                </div>
                <div className="rounded-3xl border border-black/8 bg-white/70 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-[#8a7362]">Recuperado</p>
                  <p className="mt-2 text-2xl font-semibold text-[#1f1813]">R$ 1.240</p>
                  <p className="mt-2 text-sm text-[#6b5a4d]">receita salva de furos e remarcacoes</p>
                </div>
                <div className="rounded-3xl border border-black/8 bg-white/70 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-[#8a7362]">Retorno</p>
                  <p className="mt-2 text-2xl font-semibold text-[#1f1813]">84%</p>
                  <p className="mt-2 text-sm text-[#6b5a4d]">dos clientes voltam ate o dia ideal</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="border-black/8 bg-[#1d1714] p-6 text-[#f7ede3] shadow-[0_22px_60px_rgba(41,28,20,0.14)]">
            <div className="space-y-4">
              <Badge className="rounded-full bg-white/10 text-white hover:bg-white/10">Proxima melhor acao</Badge>
              <h2 className="text-2xl font-semibold tracking-[-0.04em]">Chamar clientes que sumiram</h2>
              <p className="text-sm leading-7 text-[#d7c2b1]">
                7 clientes estao prontos para retorno. A janela de reativacao esta aberta e quinta ainda tem espaco.
              </p>
              <div className="rounded-3xl bg-white/6 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#bfa690]">Mensagem sugerida</p>
                <p className="mt-3 text-sm leading-7 text-[#f7ede3]">
                  Fala Joao, ja esta na hora de dar aquele talento. Separei dois horarios bons para voce hoje. Quer que
                  eu confirme no WhatsApp?
                </p>
              </div>
              <Button className="w-full rounded-2xl bg-[linear-gradient(135deg,#d46a30,#b84f1f)] text-white">
                Disparar agora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {revenueStats.map((stat) => {
            const Icon = stat.icon;

            return (
              <Card key={stat.title} className="border-black/8 bg-[rgba(255,250,244,0.82)] p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-[#6b5a4d]">{stat.title}</p>
                    <p className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-[#1f1813]">{stat.value}</p>
                    <p className="mt-2 text-sm text-[#8a7362]">{stat.detail}</p>
                  </div>
                  <div className={`rounded-2xl p-3 ${stat.tone}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </Card>
            );
          })}
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <Card className="border-black/8 bg-[rgba(255,250,244,0.82)] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.16em] text-[#8a7362]">Receita em movimento</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#1f1813]">
                  Agenda do dia lida como fluxo de caixa
                </h2>
              </div>
              <Button variant="outline" className="rounded-2xl border-black/8 bg-white/70">
                <CalendarRange className="mr-2 h-4 w-4" />
                Ver agenda inteligente
              </Button>
            </div>

            <div className="mt-6 space-y-3">
              {recentRevenue.map((item) => (
                <div
                  key={`${item.client}-${item.eta}`}
                  className="flex flex-col gap-3 rounded-3xl border border-black/8 bg-white/72 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-semibold text-[#1f1813]">{item.client}</p>
                    <p className="text-sm text-[#6b5a4d]">{item.action}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="rounded-full bg-[#24423a]/10 text-[#24423a] hover:bg-[#24423a]/10">{item.amount}</Badge>
                    <span className="text-sm text-[#8a7362]">{item.eta}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-black/8 bg-[rgba(255,250,244,0.82)] p-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm uppercase tracking-[0.16em] text-[#8a7362]">Oportunidades</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#1f1813]">
                  O que gera mais impacto agora
                </h2>
              </div>

              {opportunities.map((item) => (
                <div key={item.title} className="rounded-3xl border border-black/8 bg-white/72 p-4">
                  <Badge variant="outline" className="rounded-full border-[#b84f1f]/20 bg-[#b84f1f]/6 text-[#b84f1f]">
                    {item.badge}
                  </Badge>
                  <p className="mt-3 font-semibold text-[#1f1813]">{item.title}</p>
                  <p className="mt-2 text-sm leading-7 text-[#6b5a4d]">{item.description}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </div>
    </DashboardLayout>
  );
}
