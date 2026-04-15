import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, CreditCard, ExternalLink, RefreshCw, ShieldCheck } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type Plano = {
  id: number;
  codigo: string;
  nome: string;
  descricao?: string | null;
  preco: number;
  periodo: string;
  ativo: boolean;
};

type AssinaturaAtual = {
  id: number;
  status: string;
  gateway: string;
  checkoutUrl?: string | null;
  currentPeriodStart?: string | null;
  currentPeriodEnd?: string | null;
  trialEndsAt?: string | null;
  cancelAtPeriodEnd: boolean;
  ativa: boolean;
  plano?: Plano | null;
  usuario?: { id: number; nome: string; email: string; telefone?: string | null } | null;
};

type BillingResponse = {
  usuario: { id: number; nome: string; email: string; telefone?: string | null } | null;
  barbearia: { id: number; nome: string; slug?: string | null } | null;
  assinatura: AssinaturaAtual | null;
  planos: Plano[];
};

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

function formatDate(value?: string | null) {
  if (!value) return "Sem data definida";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Sem data definida" : dateFormatter.format(date);
}

function statusLabel(status?: string) {
  const labels: Record<string, string> = {
    trialing: "Teste grátis",
    pending: "Aguardando pagamento",
    active: "Ativa",
    past_due: "Pagamento atrasado",
    canceled: "Cancelada",
    expired: "Expirada",
  };
  return labels[status || ""] || "Sem assinatura";
}

function statusClass(status?: string) {
  if (status === "active") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "trialing") return "border-blue-200 bg-blue-50 text-blue-700";
  if (status === "pending") return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-red-200 bg-red-50 text-red-700";
}

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json") ? await response.json() : null;
  if (!response.ok) {
    throw new Error(payload?.message || payload?.error || "Não foi possível processar a assinatura.");
  }
  return payload as T;
}

export default function Assinatura() {
  const [billing, setBilling] = useState<BillingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const selectedPlan = useMemo(() => billing?.planos?.[0] || billing?.assinatura?.plano || null, [billing]);

  const loadBilling = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/billing/subscription");
      setBilling(await parseResponse<BillingResponse>(response));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao carregar assinatura.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBilling();
  }, [loadBilling]);

  async function handleCheckout() {
    if (!selectedPlan) {
      toast.error("Nenhum plano disponível para assinatura.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planoId: selectedPlan.id }),
      });
      const payload = await parseResponse<{ checkoutUrl?: string }>(response);

      if (!payload.checkoutUrl) {
        throw new Error("O Asaas não retornou o link de pagamento.");
      }

      window.location.href = payload.checkoutUrl;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao iniciar pagamento.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCancel() {
    setSubmitting(true);
    try {
      const response = await fetch("/api/billing/cancel", { method: "POST" });
      await parseResponse<AssinaturaAtual>(response);
      toast.success("Assinatura cancelada.");
      await loadBilling();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao cancelar assinatura.");
    } finally {
      setSubmitting(false);
    }
  }

  const assinatura = billing?.assinatura;
  const status = assinatura?.status;
  const planPrice = selectedPlan ? currencyFormatter.format(selectedPlan.preco) : "R$ 39,90";
  const periodEnd = assinatura?.currentPeriodEnd || assinatura?.trialEndsAt;

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Assinatura</h1>
            <p className="mt-1 text-slate-600">Gerencie o plano do perfil logado que libera agenda, clientes, serviços e chatbot.</p>
          </div>
          <Button variant="outline" onClick={loadBilling} disabled={loading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar status
          </Button>
        </div>

        {loading ? (
          <Card className="p-6 text-slate-600">Carregando assinatura...</Card>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
            <Card className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Plano atual</p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-900">{assinatura?.plano?.nome || selectedPlan?.nome}</h2>
                  <p className="mt-2 text-slate-600">{billing?.usuario?.nome || "Perfil logado"}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {billing?.barbearia?.nome ? `Barbearia: ${billing.barbearia.nome}` : "Você pode assinar antes de cadastrar a barbearia."}
                  </p>
                </div>
                <Badge className={statusClass(status)}>{statusLabel(status)}</Badge>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-slate-200 p-4">
                  <p className="text-sm text-slate-500">Valor</p>
                  <p className="mt-1 text-xl font-bold text-slate-900">{planPrice}</p>
                </div>
                <div className="rounded-lg border border-slate-200 p-4">
                  <p className="text-sm text-slate-500">Renovação</p>
                  <p className="mt-1 text-xl font-bold text-slate-900">{formatDate(periodEnd)}</p>
                </div>
                <div className="rounded-lg border border-slate-200 p-4">
                  <p className="text-sm text-slate-500">Gateway</p>
                  <p className="mt-1 text-xl font-bold text-slate-900">Asaas</p>
                </div>
              </div>

              {!assinatura?.ativa && (
                <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                  Sua assinatura precisa estar ativa para liberar agenda, clientes, serviços, dashboard e chatbot público.
                </div>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleCheckout} disabled={submitting}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  {submitting ? "Abrindo pagamento..." : assinatura?.ativa ? "Atualizar pagamento" : "Assinar agora"}
                </Button>
                {assinatura?.checkoutUrl && (
                  <Button variant="outline" asChild>
                    <a href={assinatura.checkoutUrl} target="_blank" rel="noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Abrir último checkout
                    </a>
                  </Button>
                )}
                {assinatura?.ativa && (
                  <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-50" onClick={handleCancel} disabled={submitting}>
                    Cancelar assinatura
                  </Button>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Plano Profissional</h2>
                  <p className="text-slate-600">{planPrice}/mês</p>
                </div>
              </div>

              <div className="mt-6 space-y-3 text-sm text-slate-700">
                {[
                  "Uma barbearia por perfil",
                  "Assinatura vinculada ao dono logado",
                  "Agenda real com horários da barbearia",
                  "Clientes e serviços reais",
                  "Chatbot público de agendamento",
                  "Dashboard por data selecionada",
                  "Trial grátis de 7 dias",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
