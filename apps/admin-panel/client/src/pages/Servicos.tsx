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
import { Clock, DollarSign, Pencil, Plus, Scissors, Star } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const SELECTED_BARBERSHOP_STORAGE_KEY = "cortecerto.selectedBarbershopId";

const DEFAULT_FORM = {
  nome: "",
  descricao: "",
  preco: 0,
  duracaoMin: 30,
  depositoAntecipado: 0,
  ativo: true,
  destaqueLink: false,
  ordemLink: 0,
  categoria: "servico",
};

type BarbeariaSummary = {
  id: number;
  nome: string;
  slug?: string;
  cidade?: string | null;
};

type Servico = {
  id: number;
  nome: string;
  descricao?: string | null;
  preco: number;
  duracaoMin: number;
  barbeariaId: number;
  ativo: boolean;
  destaqueLink: boolean;
  ordemLink: number;
  depositoAntecipado: number;
  categoria: string;
  tempoRetornoDias?: number | null;
};

type ServicoForm = typeof DEFAULT_FORM;

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value || 0));
}

function toWholeReais(value: unknown) {
  const normalized = String(value ?? "0").includes(",")
    ? String(value ?? "0").replace(/\./g, "").replace(",", ".")
    : String(value ?? "0");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? Math.max(0, Math.round(parsed)) : 0;
}

async function parseResponse(response: Response) {
  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    throw new Error(payload?.message || payload?.error || "Não foi possível concluir a operação.");
  }

  return payload;
}

export default function Servicos() {
  const [shops, setShops] = useState<BarbeariaSummary[]>([]);
  const [selectedShopId, setSelectedShopId] = useState("");
  const [services, setServices] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingServices, setLoadingServices] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
  const [form, setForm] = useState<ServicoForm>(DEFAULT_FORM);

  const selectedShop = useMemo(
    () => shops.find((shop) => String(shop.id) === selectedShopId),
    [selectedShopId, shops]
  );

  const selectedShopServices = useMemo(
    () => services.filter((service) => String(service.barbeariaId) === selectedShopId),
    [selectedShopId, services]
  );

  const activeLinkServices = selectedShopServices.filter((service) => service.ativo).length;

  const loadShops = useCallback(async () => {
    const response = await fetch("/api/barbearias");
    const payload = await parseResponse(response);
    const list = Array.isArray(payload)
      ? payload.map((shop) => ({
          id: shop.id,
          nome: shop.nome,
          slug: shop.slug,
          cidade: shop.cidade,
        }))
      : [];

    setShops(list);

    if (list.length) {
      const storedId = window.localStorage.getItem(SELECTED_BARBERSHOP_STORAGE_KEY);
      const preferredShop = list.find((item) => String(item.id) === storedId) || list[0];
      setSelectedShopId(String(preferredShop.id));
    }
  }, []);

  const loadServices = useCallback(async () => {
    setLoadingServices(true);
    try {
      const response = await fetch("/api/servicos");
      const payload = await parseResponse(response);
      setServices(Array.isArray(payload) ? payload : []);
    } finally {
      setLoadingServices(false);
    }
  }, []);

  useEffect(() => {
    async function initialize() {
      try {
        setLoading(true);
        await Promise.all([loadShops(), loadServices()]);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Falha ao carregar serviços.");
      } finally {
        setLoading(false);
      }
    }

    initialize();
  }, [loadServices, loadShops]);

  useEffect(() => {
    if (selectedShopId) {
      window.localStorage.setItem(SELECTED_BARBERSHOP_STORAGE_KEY, selectedShopId);
    }
  }, [selectedShopId]);

  function updateField<K extends keyof ServicoForm>(field: K, value: ServicoForm[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function openCreateDialog() {
    setEditingServiceId(null);
    setForm(DEFAULT_FORM);
    setDialogOpen(true);
  }

  function openEditDialog(service: Servico) {
    setEditingServiceId(service.id);
    setForm({
      nome: service.nome || "",
      descricao: service.descricao || "",
      preco: toWholeReais(service.preco),
      duracaoMin: Number(service.duracaoMin || 30),
      depositoAntecipado: toWholeReais(service.depositoAntecipado),
      ativo: service.ativo ?? true,
      destaqueLink: service.destaqueLink ?? false,
      ordemLink: Number(service.ordemLink || 0),
      categoria: service.categoria || "servico",
    });
    setDialogOpen(true);
  }

  async function handleSaveService(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedShopId) {
      toast.error("Selecione uma barbearia antes de cadastrar serviços.");
      return;
    }

    if (!form.nome.trim()) {
      toast.error("Informe o nome do serviço.");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        nome: form.nome.trim(),
        descricao: form.descricao.trim() || null,
        preco: toWholeReais(form.preco),
        duracaoMin: Number(form.duracaoMin || 30),
        barbeariaId: Number(selectedShopId),
        ativo: form.ativo,
        destaqueLink: form.destaqueLink,
        ordemLink: Number(form.ordemLink || 0),
        depositoAntecipado: toWholeReais(form.depositoAntecipado),
        categoria: form.categoria || "servico",
      };

      const response = await fetch(editingServiceId ? `/api/servicos/${editingServiceId}` : "/api/servicos", {
        method: editingServiceId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      await parseResponse(response);
      await loadServices();
      setDialogOpen(false);
      toast.success(editingServiceId ? "Serviço atualizado." : "Serviço cadastrado.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao salvar o serviço.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Serviços</h1>
            <p className="mt-1 text-slate-600">Cadastre os serviços que aparecem no chat de agendamento.</p>
          </div>
          <Button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            onClick={openCreateDialog}
            disabled={!selectedShopId || loading}
          >
            <Plus className="h-4 w-4" />
            Novo serviço
          </Button>
        </div>

        <Card className="p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="w-full max-w-xl space-y-2">
              <Label className="text-slate-700">Barbearia</Label>
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
            <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-3 lg:min-w-[420px]">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="font-semibold text-slate-900">{selectedShopServices.length}</p>
                <p>serviços cadastrados</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="font-semibold text-slate-900">{activeLinkServices}</p>
                <p>ativos no link</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="truncate font-semibold text-slate-900">{selectedShop?.slug || "-"}</p>
                <p>slug público</p>
              </div>
            </div>
          </div>
        </Card>

        {!shops.length && !loading && (
          <Card className="p-6 text-center text-slate-600">
            Cadastre uma barbearia em Configurações antes de criar serviços.
          </Card>
        )}

        {selectedShopId && (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {selectedShopServices.map((service) => (
                <Card key={service.id} className="p-6 transition-shadow hover:shadow-lg">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-slate-900">{service.nome}</h3>
                        <p className="mt-1 text-sm leading-6 text-slate-600">{service.descricao || "Sem descrição"}</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(service)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Clock className="h-4 w-4 text-slate-400" />
                        {service.duracaoMin} min
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <DollarSign className="h-4 w-4 text-slate-400" />
                        {formatCurrency(service.preco)}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 border-t border-slate-200 pt-4">
                      <Badge className={service.ativo ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-slate-100 text-slate-700 hover:bg-slate-100"}>
                        {service.ativo ? "Ativo no chat" : "Inativo"}
                      </Badge>
                      {service.destaqueLink && (
                        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                          <Star className="mr-1 h-3 w-3" />
                          Destaque
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {!selectedShopServices.length && !loadingServices && (
              <Card className="p-8 text-center">
                <Scissors className="mx-auto h-10 w-10 text-slate-300" />
                <h3 className="mt-4 text-lg font-semibold text-slate-900">Nenhum serviço cadastrado</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Crie um serviço ativo para ele aparecer no chat de agendamento da barbearia.
                </p>
                <Button className="mt-5 bg-blue-600 hover:bg-blue-700" onClick={openCreateDialog}>
                  Criar primeiro serviço
                </Button>
              </Card>
            )}

            <Card className="p-6">
              <h3 className="mb-4 font-bold text-slate-900">Resumo completo</h3>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200">
                    <TableHead className="text-slate-700">Serviço</TableHead>
                    <TableHead className="text-slate-700">Duração</TableHead>
                    <TableHead className="text-slate-700">Preço</TableHead>
                    <TableHead className="text-slate-700">Sinal</TableHead>
                    <TableHead className="text-slate-700">Status</TableHead>
                    <TableHead className="text-right text-slate-700">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedShopServices.map((service) => (
                    <TableRow key={service.id} className="border-slate-200 hover:bg-slate-50">
                      <TableCell>
                        <p className="font-medium text-slate-900">{service.nome}</p>
                        <p className="text-sm text-slate-600">{service.descricao || "Sem descrição"}</p>
                      </TableCell>
                      <TableCell className="text-slate-600">{service.duracaoMin} min</TableCell>
                      <TableCell className="font-semibold text-slate-900">{formatCurrency(service.preco)}</TableCell>
                      <TableCell className="text-slate-600">{formatCurrency(service.depositoAntecipado)}</TableCell>
                      <TableCell>
                        <Badge className={service.ativo ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-slate-100 text-slate-700 hover:bg-slate-100"}>
                          {service.ativo ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700" onClick={() => openEditDialog(service)}>
                          Editar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <form onSubmit={handleSaveService} className="space-y-5">
            <DialogHeader>
              <DialogTitle>{editingServiceId ? "Editar serviço" : "Novo serviço"}</DialogTitle>
              <DialogDescription>
                Serviços ativos aparecem como opções no chat de agendamento da barbearia selecionada.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label>Nome do serviço</Label>
                <Input value={form.nome} onChange={(event) => updateField("nome", event.target.value)} placeholder="Corte masculino" required />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Descrição</Label>
                <Textarea value={form.descricao} onChange={(event) => updateField("descricao", event.target.value)} placeholder="Descrição curta para orientar o cliente" />
              </div>
              <div className="space-y-2">
                <Label>Preço</Label>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  value={form.preco}
                  onChange={(event) => updateField("preco", toWholeReais(event.target.value))}
                  onBlur={() => updateField("preco", toWholeReais(form.preco))}
                  required
                />
                <p className="text-xs text-slate-500">Informe apenas reais inteiros. Exemplo: {formatCurrency(form.preco)}</p>
              </div>
              <div className="space-y-2">
                <Label>Duração em minutos</Label>
                <Input type="number" min="5" step="5" value={form.duracaoMin} onChange={(event) => updateField("duracaoMin", Number(event.target.value || 30))} required />
              </div>
              <div className="space-y-2">
                <Label>Sinal antecipado</Label>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  value={form.depositoAntecipado}
                  onChange={(event) => updateField("depositoAntecipado", toWholeReais(event.target.value))}
                  onBlur={() => updateField("depositoAntecipado", toWholeReais(form.depositoAntecipado))}
                />
                <p className="text-xs text-slate-500">Informe apenas reais inteiros. Exemplo: {formatCurrency(form.depositoAntecipado)}</p>
              </div>
              <div className="space-y-2">
                <Label>Ordem no link</Label>
                <Input type="number" min="0" value={form.ordemLink} onChange={(event) => updateField("ordemLink", Number(event.target.value || 0))} />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <div>
                  <p className="font-medium text-slate-900">Ativo no chat</p>
                  <p className="text-sm text-slate-600">Desative para ocultar do link público.</p>
                </div>
                <Switch checked={form.ativo} onCheckedChange={(checked) => updateField("ativo", checked)} />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <div>
                  <p className="font-medium text-slate-900">Destaque no link</p>
                  <p className="text-sm text-slate-600">Mostra antes dos demais serviços.</p>
                </div>
                <Switch checked={form.destaqueLink} onCheckedChange={(checked) => updateField("destaqueLink", checked)} />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={saving}>
                {saving ? "Salvando..." : "Salvar serviço"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
