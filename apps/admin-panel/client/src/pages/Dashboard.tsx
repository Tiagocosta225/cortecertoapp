import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, Clock, DollarSign, ShieldCheck, TrendingUp, Users } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";

const SELECTED_BARBERSHOP_STORAGE_KEY = "cortecerto.selectedBarbershopId";

type BarbeariaSummary = {
  id: number;
  nome: string;
  cidade?: string | null;
};

type Overview = {
  barbearia: { id: number; nome: string; slug?: string };
  hoje: {
    agendamentos: number;
    reservasProtegidas: number;
    faturamentoPrevisto: number;
    capacidadeSlots?: number;
    ocupacaoPercentual?: number;
  };
  semana: {
    faturamento: number;
    meta: number;
  };
  crm: {
    totalClientes?: number;
    clientesEmRisco: number;
    clientesReativados: number;
  };
  antiFuro: {
    protegidos: number;
    pagamentosPendentes: number;
  };
};

type AgendaDay = {
  date: string;
  faturamentoPrevisto: number;
  ocupacao: number;
  slotsLivres: number;
  recomendacao: string;
  agendamentos: Array<{
    id: number;
    horario: string;
    cliente: string;
    servico: string;
    status: string;
    statusPagamento: string;
    valorTotal: number;
  }>;
};

type AgendaInteligente = {
  barbearia: { id: number; nome: string };
  dias: AgendaDay[];
};

type ClientesInsights = {
  resumo: {
    totalClientes: number;
    clientesEmRisco: number;
  };
};

async function parseResponse(response: Response) {
  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    throw new Error(payload?.message || payload?.error || "Não foi possível carregar o dashboard.");
  }

  return payload;
}

function toDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value || 0));
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function Dashboard() {
  const [shops, setShops] = useState<BarbeariaSummary[]>([]);
  const [selectedShopId, setSelectedShopId] = useState("");
  const [overview, setOverview] = useState<Overview | null>(null);
  const [agenda, setAgenda] = useState<AgendaInteligente | null>(null);
  const [clientesInsights, setClientesInsights] = useState<ClientesInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingDashboard, setLoadingDashboard] = useState(false);

  const today = useMemo(() => toDateInput(new Date()), []);
  const [selectedDate, setSelectedDate] = useState(today);
  const selectedShop = shops.find((shop) => String(shop.id) === selectedShopId);
  const todayAgenda = agenda?.dias?.[0];
  const upcomingAppointments = todayAgenda?.agendamentos || [];
  const selectedDateLabel = new Date(`${selectedDate}T00:00:00`).toLocaleDateString("pt-BR");

  const stats = [
    {
      title: "Agendamentos do dia",
      value: String(overview?.hoje.agendamentos ?? 0),
      icon: Calendar,
      color: "bg-blue-100 text-blue-600",
      trend: `${overview?.hoje.capacidadeSlots ?? 0} slots no expediente`,
    },
    {
      title: "Faturamento do dia",
      value: formatCurrency(overview?.hoje.faturamentoPrevisto ?? 0),
      icon: DollarSign,
      color: "bg-green-100 text-green-600",
      trend: `Semana: ${formatCurrency(overview?.semana.faturamento ?? 0)}`,
    },
    {
      title: "Clientes",
      value: String(clientesInsights?.resumo.totalClientes ?? overview?.crm.totalClientes ?? 0),
      icon: Users,
      color: "bg-sky-100 text-sky-700",
      trend: `${clientesInsights?.resumo.clientesEmRisco ?? overview?.crm.clientesEmRisco ?? 0} em risco`,
    },
    {
      title: "Taxa de ocupação",
      value: `${overview?.hoje.ocupacaoPercentual ?? 0}%`,
      icon: TrendingUp,
      color: "bg-indigo-100 text-indigo-700",
      trend: `${todayAgenda?.slotsLivres ?? 0} horários livres`,
    },
  ];

  const loadDashboard = useCallback(async (shopId: string, date: string) => {
    if (!shopId) return;

    setLoadingDashboard(true);
    try {
      const searchParams = new URLSearchParams({ date });
      const [overviewResponse, agendaResponse, clientesResponse] = await Promise.all([
        fetch(`/api/dashboard/barbearias/${shopId}/overview?${searchParams.toString()}`),
        fetch(`/api/dashboard/barbearias/${shopId}/agenda-inteligente?date=${date}&days=1`),
        fetch(`/api/dashboard/barbearias/${shopId}/clientes-insights`),
      ]);

      const [overviewPayload, agendaPayload, clientesPayload] = await Promise.all([
        parseResponse(overviewResponse),
        parseResponse(agendaResponse),
        parseResponse(clientesResponse),
      ]);

      setOverview(overviewPayload);
      setAgenda(agendaPayload);
      setClientesInsights(clientesPayload);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao carregar dashboard.");
    } finally {
      setLoadingDashboard(false);
    }
  }, []);

  useEffect(() => {
    async function loadShops() {
      try {
        setLoading(true);
        const response = await fetch("/api/barbearias");
        const payload = await parseResponse(response);
        const list = Array.isArray(payload)
          ? payload.map((shop) => ({
              id: shop.id,
              nome: shop.nome,
              cidade: shop.cidade,
            }))
          : [];

        setShops(list);
        if (list.length) {
          const storedId = window.localStorage.getItem(SELECTED_BARBERSHOP_STORAGE_KEY);
          const preferredShop = list.find((shop) => String(shop.id) === storedId) || list[0];
          setSelectedShopId(String(preferredShop.id));
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Falha ao carregar barbearias.");
      } finally {
        setLoading(false);
      }
    }

    loadShops();
  }, []);

  useEffect(() => {
    if (!selectedShopId) return;

    window.localStorage.setItem(SELECTED_BARBERSHOP_STORAGE_KEY, selectedShopId);
    loadDashboard(selectedShopId, selectedDate);
  }, [loadDashboard, selectedDate, selectedShopId]);

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="mt-1 text-slate-600">Dados reais da barbearia, agenda, clientes e faturamento.</p>
          </div>
          <div className="grid w-full gap-3 sm:max-w-xl sm:grid-cols-[1fr_180px]">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Barbearia</label>
              <Select value={selectedShopId} onValueChange={setSelectedShopId} disabled={loading || !shops.length}>
                <SelectTrigger className="w-full border-slate-200 bg-slate-50">
                  <SelectValue placeholder="Selecione uma barbearia" />
                </SelectTrigger>
                <SelectContent>
                  {shops.map((shop) => (
                    <SelectItem key={shop.id} value={String(shop.id)}>
                      {shop.nome}{shop.cidade ? ` • ${shop.cidade}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Data do dashboard</label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value || today)}
                className="border-slate-200 bg-slate-50"
                disabled={loadingDashboard}
              />
            </div>
          </div>
        </div>

        {!shops.length && !loading && (
          <Card className="p-8 text-center text-slate-600">
            Cadastre uma barbearia para liberar os dados do dashboard.
          </Card>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="p-6 transition-shadow hover:shadow-lg">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900">{loadingDashboard ? "..." : stat.value}</p>
                    <p className="mt-2 text-xs text-slate-500">{stat.trend}</p>
                  </div>
                  <div className={`rounded-lg p-3 ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="p-6 lg:col-span-2">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Agendamentos do dia</h2>
                <p className="mt-1 text-sm text-slate-600">
                  {selectedShop?.nome || "Barbearia"} • {selectedDateLabel}
                </p>
              </div>
              <Button asChild variant="outline">
                <Link href="/agenda">Ver agenda completa</Link>
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow className="border-slate-200">
                  <TableHead className="text-slate-700">Cliente</TableHead>
                  <TableHead className="text-slate-700">Serviço</TableHead>
                  <TableHead className="text-slate-700">Horário</TableHead>
                  <TableHead className="text-slate-700">Valor</TableHead>
                  <TableHead className="text-slate-700">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingAppointments.map((appointment) => (
                  <TableRow key={appointment.id} className="border-slate-200 hover:bg-slate-50">
                    <TableCell className="font-medium text-slate-900">{appointment.cliente}</TableCell>
                    <TableCell className="text-slate-600">{appointment.servico}</TableCell>
                    <TableCell className="text-slate-600">
                      <span className="inline-flex items-center gap-2">
                        <Clock className="h-4 w-4 text-slate-400" />
                        {formatTime(appointment.horario)}
                      </span>
                    </TableCell>
                    <TableCell className="font-semibold text-slate-900">{formatCurrency(appointment.valorTotal)}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          appointment.status === "confirmado"
                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                            : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                        }
                      >
                        {appointment.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {!upcomingAppointments.length && !loadingDashboard && (
              <div className="py-10 text-center text-slate-600">
                Nenhum agendamento confirmado para o dia selecionado.
              </div>
            )}
          </Card>

          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-3 text-blue-700">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Anti-furo</h3>
                  <p className="text-sm text-slate-600">Reservas protegidas na semana</p>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-2xl font-bold text-slate-900">{overview?.antiFuro.protegidos ?? 0}</p>
                  <p className="text-sm text-slate-600">protegidos</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-2xl font-bold text-slate-900">{overview?.antiFuro.pagamentosPendentes ?? 0}</p>
                  <p className="text-sm text-slate-600">pagamentos pendentes</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-green-100 p-3 text-green-700">
                  <DollarSign className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Meta semanal</h3>
                  <p className="text-sm text-slate-600">Faturamento registrado</p>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Atual</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(overview?.semana.faturamento ?? 0)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Meta</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(overview?.semana.meta ?? 0)}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-600"
                    style={{
                      width: `${Math.min(
                        100,
                        overview?.semana.meta
                          ? (Number(overview.semana.faturamento || 0) / Number(overview.semana.meta || 1)) * 100
                          : 0
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
