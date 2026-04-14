import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Mail, MoreVertical, Phone, Plus, Search, UserRound } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const SELECTED_BARBERSHOP_STORAGE_KEY = "cortecerto.selectedBarbershopId";

const DEFAULT_FORM = {
  nome: "",
  telefone: "",
  email: "",
  aceitaWhatsapp: true,
  statusRelacionamento: "ativo",
  observacoes: "",
};

type BarbeariaSummary = {
  id: number;
  nome: string;
  cidade?: string | null;
};

type Agendamento = {
  id: number;
  data: string;
  status: string;
  valorServico?: number;
  valorReserva?: number;
  servico?: {
    nome: string;
    preco: number;
  } | null;
};

type Cliente = {
  id: number;
  nome: string;
  telefone: string;
  email?: string | null;
  aceitaWhatsapp: boolean;
  statusRelacionamento: string;
  observacoes?: string | null;
  origem: string;
  ultimaVisita?: string | null;
  totalGasto: number;
  visitas: number;
  barbeariaId: number;
  agendamentos?: Agendamento[];
};

type ClienteForm = typeof DEFAULT_FORM;

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value || 0));
}

function formatDate(value?: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("pt-BR");
}

function getClientStats(client: Cliente) {
  const appointments = client.agendamentos || [];
  const validAppointments = appointments.filter((item) => item.status !== "cancelado");
  const totalSpent = validAppointments.reduce(
    (sum, item) => sum + Number(item.valorServico || item.servico?.preco || 0) + Number(item.valorReserva || 0),
    0
  );
  const lastVisit = validAppointments[0]?.data || client.ultimaVisita || null;

  return {
    visits: validAppointments.length || Number(client.visitas || 0),
    totalSpent: totalSpent || Number(client.totalGasto || 0),
    lastVisit,
  };
}

async function parseResponse(response: Response) {
  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    throw new Error(payload?.message || payload?.error || "Não foi possível carregar clientes.");
  }

  return payload;
}

export default function Clientes() {
  const [shops, setShops] = useState<BarbeariaSummary[]>([]);
  const [selectedShopId, setSelectedShopId] = useState("");
  const [clients, setClients] = useState<Cliente[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingClients, setLoadingClients] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailsClient, setDetailsClient] = useState<Cliente | null>(null);
  const [editingClientId, setEditingClientId] = useState<number | null>(null);
  const [form, setForm] = useState<ClienteForm>(DEFAULT_FORM);

  const selectedShop = shops.find((shop) => String(shop.id) === selectedShopId);

  const filteredClients = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return clients;

    return clients.filter((client) =>
      [client.nome, client.email || "", client.telefone]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [clients, searchTerm]);

  const totals = useMemo(
    () =>
      clients.reduce(
        (summary, client) => {
          const stats = getClientStats(client);
          return {
            visits: summary.visits + stats.visits,
            revenue: summary.revenue + stats.totalSpent,
          };
        },
        { visits: 0, revenue: 0 }
      ),
    [clients]
  );

  const loadClients = useCallback(async (shopId: string) => {
    if (!shopId) return;

    setLoadingClients(true);
    try {
      const params = new URLSearchParams({ barbeariaId: shopId });
      const response = await fetch(`/api/clientes?${params.toString()}`);
      const payload = await parseResponse(response);
      setClients(Array.isArray(payload) ? payload : []);
    } finally {
      setLoadingClients(false);
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
    loadClients(selectedShopId).catch((error) => {
      toast.error(error instanceof Error ? error.message : "Falha ao carregar clientes.");
    });
  }, [loadClients, selectedShopId]);

  function updateField<K extends keyof ClienteForm>(field: K, value: ClienteForm[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function openCreateDialog() {
    setEditingClientId(null);
    setForm(DEFAULT_FORM);
    setDialogOpen(true);
  }

  function openEditDialog(client: Cliente) {
    setEditingClientId(client.id);
    setForm({
      nome: client.nome || "",
      telefone: client.telefone || "",
      email: client.email || "",
      aceitaWhatsapp: client.aceitaWhatsapp ?? true,
      statusRelacionamento: client.statusRelacionamento || "ativo",
      observacoes: client.observacoes || "",
    });
    setDialogOpen(true);
  }

  async function saveClient(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedShopId) {
      toast.error("Selecione uma barbearia antes de cadastrar clientes.");
      return;
    }

    if (!form.nome.trim() || !form.telefone.trim()) {
      toast.error("Informe nome e telefone do cliente.");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        nome: form.nome.trim(),
        telefone: form.telefone.trim(),
        email: form.email.trim() || null,
        aceitaWhatsapp: form.aceitaWhatsapp,
        statusRelacionamento: form.statusRelacionamento,
        observacoes: form.observacoes.trim() || null,
        barbeariaId: Number(selectedShopId),
      };

      const response = await fetch(editingClientId ? `/api/clientes/${editingClientId}` : "/api/clientes", {
        method: editingClientId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      await parseResponse(response);
      await loadClients(selectedShopId);
      setDialogOpen(false);
      toast.success(editingClientId ? "Cliente atualizado." : "Cliente cadastrado.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao salvar cliente.");
    } finally {
      setSaving(false);
    }
  }

  async function updateClientStatus(client: Cliente, statusRelacionamento: string) {
    try {
      setSaving(true);
      const response = await fetch(`/api/clientes/${client.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statusRelacionamento }),
      });
      await parseResponse(response);
      await loadClients(selectedShopId);
      toast.success(statusRelacionamento === "bloqueado" ? "Cliente bloqueado." : "Cliente reativado.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao atualizar cliente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Clientes</h1>
            <p className="mt-1 text-slate-600">Dados reais de clientes cadastrados e vindos do chat de agendamento.</p>
          </div>
          <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700" onClick={openCreateDialog} disabled={!selectedShopId}>
            <Plus className="h-4 w-4" />
            Novo cliente
          </Button>
        </div>

        <Card className="p-5">
          <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr_0.8fr_0.8fr] lg:items-end">
            <div className="space-y-2">
              <Label>Barbearia</Label>
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
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar por nome, email ou telefone..."
                className="pl-10 bg-slate-50 border-slate-200"
              />
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">{clients.length}</p>
              <p>clientes em {selectedShop?.nome || "barbearia"}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">{formatCurrency(totals.revenue)}</p>
              <p>receita registrada</p>
            </div>
          </div>
        </Card>

        {!shops.length && !loading && (
          <Card className="p-8 text-center text-slate-600">
            Cadastre uma barbearia antes de gerenciar clientes.
          </Card>
        )}

        <Card className="p-6">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-bold text-slate-900">Lista de clientes</h3>
              <p className="text-sm text-slate-600">
                {loadingClients ? "Carregando clientes..." : `${filteredClients.length} cliente(s) encontrado(s)`}
              </p>
            </div>
            <Badge className="w-fit bg-blue-100 text-blue-700 hover:bg-blue-100">{totals.visits} visita(s)</Badge>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="border-slate-200">
                <TableHead className="text-slate-700">Nome</TableHead>
                <TableHead className="text-slate-700">Contato</TableHead>
                <TableHead className="text-slate-700">Última visita</TableHead>
                <TableHead className="text-slate-700">Visitas</TableHead>
                <TableHead className="text-slate-700">Total gasto</TableHead>
                <TableHead className="text-slate-700">Status</TableHead>
                <TableHead className="text-right text-slate-700">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => {
                const stats = getClientStats(client);
                return (
                  <TableRow key={client.id} className="border-slate-200 hover:bg-slate-50">
                    <TableCell className="font-medium text-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                          <UserRound className="h-4 w-4" />
                        </div>
                        <div>
                          <p>{client.nome}</p>
                          <p className="text-xs text-slate-500">{client.origem}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Mail className="h-4 w-4 text-slate-400" />
                          {client.email || "Sem email"}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Phone className="h-4 w-4 text-slate-400" />
                          {client.telefone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        {formatDate(stats.lastVisit)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                        {stats.visits}
                      </span>
                    </TableCell>
                    <TableCell className="font-semibold text-slate-900">{formatCurrency(stats.totalSpent)}</TableCell>
                    <TableCell>
                      <Badge className={client.statusRelacionamento === "bloqueado" ? "bg-slate-100 text-slate-700 hover:bg-slate-100" : "bg-green-100 text-green-700 hover:bg-green-100"}>
                        {client.statusRelacionamento}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" disabled={saving}>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setDetailsClient(client)}>Ver perfil</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditDialog(client)}>Editar</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setDetailsClient(client)}>Histórico</DropdownMenuItem>
                          {client.statusRelacionamento === "bloqueado" ? (
                            <DropdownMenuItem onClick={() => updateClientStatus(client, "ativo")}>Reativar</DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem className="text-red-600" onClick={() => updateClientStatus(client, "bloqueado")}>
                              Bloquear
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {!filteredClients.length && !loadingClients && (
            <div className="py-10 text-center text-slate-600">
              Nenhum cliente encontrado para essa barbearia.
            </div>
          )}
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <form onSubmit={saveClient} className="space-y-5">
            <DialogHeader>
              <DialogTitle>{editingClientId ? "Editar cliente" : "Novo cliente"}</DialogTitle>
              <DialogDescription>
                Clientes cadastrados manualmente ficam disponíveis na agenda da barbearia selecionada.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input value={form.nome} onChange={(event) => updateField("nome", event.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input value={form.telefone} onChange={(event) => updateField("telefone", event.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.statusRelacionamento} onValueChange={(value) => updateField("statusRelacionamento", value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="bloqueado">Bloqueado</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 md:col-span-2">
                <div>
                  <p className="font-medium text-slate-900">Aceita WhatsApp</p>
                  <p className="text-sm text-slate-600">Usado para relacionamento e lembretes.</p>
                </div>
                <Switch checked={form.aceitaWhatsapp} onCheckedChange={(checked) => updateField("aceitaWhatsapp", checked)} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Observações</Label>
                <Textarea value={form.observacoes} onChange={(event) => updateField("observacoes", event.target.value)} />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Fechar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={saving}>
                {saving ? "Salvando..." : "Salvar cliente"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(detailsClient)} onOpenChange={(open) => !open && setDetailsClient(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{detailsClient?.nome || "Cliente"}</DialogTitle>
            <DialogDescription>Histórico real de agendamentos do cliente.</DialogDescription>
          </DialogHeader>

          {detailsClient && (
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-sm text-slate-600">Telefone</p>
                  <p className="font-semibold text-slate-900">{detailsClient.telefone}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-sm text-slate-600">Email</p>
                  <p className="truncate font-semibold text-slate-900">{detailsClient.email || "-"}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-sm text-slate-600">WhatsApp</p>
                  <p className="font-semibold text-slate-900">{detailsClient.aceitaWhatsapp ? "Sim" : "Não"}</p>
                </div>
              </div>

              <div className="max-h-80 space-y-3 overflow-y-auto">
                {(detailsClient.agendamentos || []).map((appointment) => (
                  <div key={appointment.id} className="rounded-lg border border-slate-200 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900">{appointment.servico?.nome || "Serviço"}</p>
                        <p className="text-sm text-slate-600">
                          {formatDate(appointment.data)} às {new Date(appointment.data).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                      <Badge className={appointment.status === "cancelado" ? "bg-slate-100 text-slate-700 hover:bg-slate-100" : "bg-blue-100 text-blue-700 hover:bg-blue-100"}>
                        {appointment.status}
                      </Badge>
                    </div>
                  </div>
                ))}

                {!detailsClient.agendamentos?.length && (
                  <p className="rounded-lg bg-slate-50 p-4 text-center text-sm text-slate-600">
                    Nenhum agendamento registrado.
                  </p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
