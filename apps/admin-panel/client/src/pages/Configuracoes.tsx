import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Container, Database, Layers3, ServerCog, Workflow } from "lucide-react";

const roadmap = [
  {
    phase: "MVP",
    goal: "Link publico + agenda + anti-furo",
    items: ["Slug por barbearia", "Reserva com Pix", "WhatsApp para confirmacao", "Painel com faturamento semanal"],
  },
  {
    phase: "Operacao",
    goal: "CRM simples e automacoes",
    items: ["Clientes sumidos", "Ranking de recorrencia", "Encaixe inteligente", "Relatorios de no-show"],
  },
  {
    phase: "Escala",
    goal: "Multiunidade e regras avancadas",
    items: ["Mais de um barbeiro por unidade", "Campanhas por segmento", "LTV por cliente", "Replicacao entre ambientes"],
  },
];

const stack = [
  { title: "Frontend", description: "React web para link publico e painel do barbeiro.", icon: Layers3 },
  { title: "Backend", description: "Node.js com API simples para agendamento, CRM e cobranca.", icon: ServerCog },
  { title: "Banco", description: "PostgreSQL como base de clientes, servicos, agenda e receita.", icon: Database },
  { title: "Infra", description: "Docker pronto para deploy em ambiente on-premise.", icon: Container },
];

export default function Configuracoes() {
  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 md:p-6">
        <section>
          <Badge variant="outline" className="rounded-full border-[#b84f1f]/20 bg-white/70 text-[#b84f1f]">
            MVP → Escala
          </Badge>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#1f1813] md:text-5xl">
            Estrutura de produto e stack para rodar no mundo real.
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#6b5a4d] md:text-base">
            O caminho aqui nao e inflar o sistema. E validar receita primeiro, automatizar retorno depois e escalar a
            operacao sem perder simplicidade.
          </p>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <Card className="border-black/8 bg-[rgba(255,250,244,0.82)] p-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm uppercase tracking-[0.16em] text-[#8a7362]">Roadmap do produto</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#1f1813]">
                  Crescimento por etapas claras
                </h2>
              </div>

              {roadmap.map((step) => (
                <div key={step.phase} className="rounded-[1.6rem] border border-black/8 bg-white/72 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[#8a7362]">{step.phase}</p>
                      <h3 className="mt-2 text-xl font-semibold text-[#1f1813]">{step.goal}</h3>
                    </div>
                    <Badge className="rounded-full bg-[#24423a]/10 text-[#24423a] hover:bg-[#24423a]/10">
                      Prioridade
                    </Badge>
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {step.items.map((item) => (
                      <div key={item} className="flex items-start gap-2 rounded-2xl bg-[#f8f1e8] p-3 text-sm text-[#5d4a3d]">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#b84f1f]" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="space-y-4">
            <Card className="border-black/8 bg-[#1d1714] p-6 text-[#f7ede3]">
              <p className="text-sm uppercase tracking-[0.16em] text-[#bca694]">Infra alvo</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">Docker para deploy on-premise</h2>
              <p className="mt-3 text-sm leading-7 text-[#d7c2b1]">
                Cada camada do produto pode rodar em containers separados com configuracao simples de ambiente.
              </p>
              <Button className="mt-5 w-full rounded-2xl bg-[linear-gradient(135deg,#d46a30,#b84f1f)] text-white">
                <Workflow className="mr-2 h-4 w-4" />
                Revisar arquitetura do MVP
              </Button>
            </Card>

            {stack.map((item) => {
              const Icon = item.icon;

              return (
                <Card key={item.title} className="border-black/8 bg-[rgba(255,250,244,0.82)] p-5">
                  <div className="flex items-start gap-4">
                    <div className="rounded-2xl bg-[#b84f1f]/10 p-3 text-[#b84f1f]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#1f1813]">{item.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-[#6b5a4d]">{item.description}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
