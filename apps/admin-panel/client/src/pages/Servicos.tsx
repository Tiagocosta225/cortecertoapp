import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowUpRight, Clock3, Crown, DollarSign, Sparkles } from "lucide-react";

const services = [
  { name: "Corte assinatura", duration: "35 min", price: "R$ 45", signal: "Entrada forte no link publico", highlight: "Base MVP" },
  { name: "Corte + barba premium", duration: "50 min", price: "R$ 75", signal: "Maior margem por slot", highlight: "Mais rentavel" },
  { name: "Plano mensal", duration: "Recorrente", price: "R$ 149", signal: "Aumenta previsibilidade de caixa", highlight: "Escala" },
];

const plays = [
  "Empurrar combo premium em horarios de alta demanda",
  "Oferecer plano mensal para clientes com retorno menor que 18 dias",
  "Ativar deposito apenas em servicos premium e sextas",
];

export default function Servicos() {
  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 md:p-6">
        <section className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <Badge variant="outline" className="rounded-full border-[#b84f1f]/20 bg-white/70 text-[#b84f1f]">
              Oferta rentavel
            </Badge>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#1f1813] md:text-5xl">
              O servico certo no horario certo vale mais que agenda lotada.
            </h1>
          </div>
          <Button className="rounded-2xl bg-[linear-gradient(135deg,#d46a30,#b84f1f)] text-white">
            <Sparkles className="mr-2 h-4 w-4" />
            Criar oferta nova
          </Button>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
          <div className="grid gap-4 md:grid-cols-3">
            {services.map((service) => (
              <Card key={service.name} className="border-black/8 bg-[rgba(255,250,244,0.82)] p-5">
                <Badge className="rounded-full bg-[#24423a]/10 text-[#24423a] hover:bg-[#24423a]/10">
                  {service.highlight === "Mais rentavel" ? <Crown className="mr-1 h-3.5 w-3.5" /> : null}
                  {service.highlight}
                </Badge>
                <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-[#1f1813]">{service.name}</h2>
                <div className="mt-4 space-y-3 text-sm text-[#6b5a4d]">
                  <p className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4" />
                    {service.duration}
                  </p>
                  <p className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    {service.price}
                  </p>
                </div>
                <p className="mt-4 text-sm leading-7 text-[#6b5a4d]">{service.signal}</p>
              </Card>
            ))}
          </div>

          <Card className="border-black/8 bg-[#1d1714] p-6 text-[#f7ede3]">
            <p className="text-sm uppercase tracking-[0.16em] text-[#bca694]">Playbook de receita</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">Como vender mais com a mesma agenda</h2>
            <div className="mt-5 space-y-3">
              {plays.map((play) => (
                <div key={play} className="rounded-3xl bg-white/6 p-4 text-sm leading-7 text-[#f7ede3]">
                  {play}
                </div>
              ))}
            </div>
          </Card>
        </section>

        <Card className="border-black/8 bg-[rgba(255,250,244,0.82)] p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.16em] text-[#8a7362]">Prioridade agora</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#1f1813]">
                  Subir o combo premium na vitrine do link publico
                </h2>
              </div>
              <Button variant="outline" className="rounded-2xl border-black/8 bg-white/72">
                Aplicar sugestao
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <p className="max-w-3xl text-sm leading-7 text-[#6b5a4d]">
              O combo premium converte melhor quando aparece primeiro no calendario visual, junto com o argumento de
              reserva garantida e tag de horario mais rentavel.
            </p>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
