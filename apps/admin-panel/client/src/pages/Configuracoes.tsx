import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Bell, Building, Clock, Copy, ExternalLink, Link as LinkIcon, Lock, PlusCircle } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

type BarbeariaPayload = {
  id?: number;
  nome: string;
  telefone: string;
  endereco: string;
  descricao: string;
  cidade: string;
  instagram: string;
  whatsappLink: string;
  horarioAbertura: string;
  horarioFechamento: string;
  taxaReservaPadrao: number;
  ativa: boolean;
  aceitaReservaPix: boolean;
  slug?: string;
};

type BarbeariaSummary = {
  id: number;
  nome: string;
  slug?: string;
  cidade?: string | null;
};

const DEFAULT_FORM: BarbeariaPayload = {
  nome: "CorteCerto Barbershop",
  telefone: "(11) 9999-9999",
  endereco: "Rua Principal, 123",
  descricao: "Barbearia moderna com profissionais experientes",
  cidade: "São Paulo",
  instagram: "@cortecertoapp",
  whatsappLink: "",
  horarioAbertura: "09:00",
  horarioFechamento: "18:00",
  taxaReservaPadrao: 10,
  ativa: true,
  aceitaReservaPix: true,
};

const SELECTED_BARBERSHOP_STORAGE_KEY = "cortecerto.selectedBarbershopId";

function getPublicBaseUrl() {
  const configured = import.meta.env.VITE_PUBLIC_BOOKING_BASE_URL;
  if (configured) {
    return configured.replace(/\/+$/, "");
  }

  const current = new URL(window.location.origin);
  if (current.hostname.startsWith("admin.")) {
    current.hostname = current.hostname.replace(/^admin\./, "frontend.");
  }

  return current.origin;
}

async function parseResponse(response: Response) {
  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    throw new Error(payload?.message || payload?.error || "Não foi possível salvar as configurações.");
  }

  return payload;
}

export default function Configuracoes() {
  const [shops, setShops] = useState<BarbeariaSummary[]>([]);
  const [selectedShopId, setSelectedShopId] = useState<string>("new");
  const [form, setForm] = useState<BarbeariaPayload>(DEFAULT_FORM);
  const [shopId, setShopId] = useState<number | null>(null);
  const [slug, setSlug] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [loadingShop, setLoadingShop] = useState(true);
  const [savingShop, setSavingShop] = useState(false);

  const publicBaseUrl = useMemo(() => getPublicBaseUrl(), []);
  const publicBookingLink = slug ? `${publicBaseUrl}/${slug}` : "";

  const applyShopToForm = useCallback((shop: any) => {
    setShopId(shop.id);
    setSlug(shop.slug || "");
    setForm({
      nome: shop.nome || "",
      telefone: shop.telefone || "",
      endereco: shop.endereco || "",
      descricao: shop.descricao || "",
      cidade: shop.cidade || "",
      instagram: shop.instagram || "",
      whatsappLink: shop.whatsappLink || "",
      horarioAbertura: shop.horarioAbertura || "09:00",
      horarioFechamento: shop.horarioFechamento || "18:00",
      taxaReservaPadrao: Number(shop.taxaReservaPadrao || 0),
      ativa: shop.ativa ?? true,
      aceitaReservaPix: shop.aceitaReservaPix ?? true,
      slug: shop.slug || "",
    });
  }, []);

  const resetToNewShop = useCallback(() => {
    setShopId(null);
    setSlug("");
    setForm(DEFAULT_FORM);
  }, []);

  const loadShops = useCallback(async () => {
    setLoadingList(true);
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
    setLoadingList(false);
    return list;
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      try {
        const list = await loadShops();
        if (cancelled) return;

        if (!list.length) {
          setSelectedShopId("new");
          resetToNewShop();
          setLoadingShop(false);
          return;
        }

        const storedId = window.localStorage.getItem(SELECTED_BARBERSHOP_STORAGE_KEY);
        const preferredShop = list.find((item) => String(item.id) === storedId) || list[0];
        setSelectedShopId(String(preferredShop.id));
      } catch (error) {
        if (!cancelled) {
          toast.error(error instanceof Error ? error.message : "Falha ao carregar a barbearia.");
          setLoadingList(false);
          setLoadingShop(false);
        }
      }
    }

    initialize();
    return () => {
      cancelled = true;
    };
  }, [loadShops, resetToNewShop]);

  useEffect(() => {
    let cancelled = false;

    async function loadSelectedShop() {
      if (selectedShopId === "new") {
        resetToNewShop();
        setLoadingShop(false);
        window.localStorage.removeItem(SELECTED_BARBERSHOP_STORAGE_KEY);
        return;
      }

      try {
        setLoadingShop(true);
        window.localStorage.setItem(SELECTED_BARBERSHOP_STORAGE_KEY, selectedShopId);
        const response = await fetch(`/api/barbearias/${selectedShopId}`);
        const payload = await parseResponse(response);

        if (cancelled) return;
        applyShopToForm(payload);
      } catch (error) {
        if (!cancelled) {
          toast.error(error instanceof Error ? error.message : "Falha ao carregar a barbearia selecionada.");
        }
      } finally {
        if (!cancelled) {
          setLoadingShop(false);
        }
      }
    }

    loadSelectedShop();
    return () => {
      cancelled = true;
    };
  }, [applyShopToForm, resetToNewShop, selectedShopId]);

  function updateField<K extends keyof BarbeariaPayload>(field: K, value: BarbeariaPayload[K]) {
    setForm(current => ({ ...current, [field]: value }));
  }

  async function handleSaveBarbearia() {
    try {
      setSavingShop(true);

      const payload = {
        nome: form.nome,
        telefone: form.telefone,
        endereco: form.endereco,
        descricao: form.descricao,
        cidade: form.cidade,
        instagram: form.instagram,
        whatsappLink: form.whatsappLink,
        horarioAbertura: form.horarioAbertura,
        horarioFechamento: form.horarioFechamento,
        taxaReservaPadrao: Number(form.taxaReservaPadrao || 0),
        ativa: form.ativa,
        aceitaReservaPix: form.aceitaReservaPix,
      };

      const response = await fetch(shopId ? `/api/barbearias/${shopId}` : "/api/barbearias", {
        method: shopId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const savedShop = await parseResponse(response);
      applyShopToForm(savedShop);
      const updatedList = await loadShops();
      const savedId = String(savedShop.id);
      setSelectedShopId(savedId);
      window.localStorage.setItem(SELECTED_BARBERSHOP_STORAGE_KEY, savedId);

      if (!updatedList.some((item) => String(item.id) === savedId)) {
        setShops((current) => [
          ...current,
          { id: savedShop.id, nome: savedShop.nome, slug: savedShop.slug, cidade: savedShop.cidade },
        ]);
      }

      toast.success(shopId ? "Barbearia atualizada com sucesso." : "Barbearia criada com sucesso.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao salvar a barbearia.");
    } finally {
      setSavingShop(false);
    }
  }

  async function handleCopyLink() {
    if (!publicBookingLink) return;

    try {
      await navigator.clipboard.writeText(publicBookingLink);
      toast.success("Link público copiado.");
    } catch {
      toast.error("Não foi possível copiar o link.");
    }
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Configurações</h1>
          <p className="text-slate-600 mt-1">Gerencie as configurações da sua barbearia</p>
        </div>

        <Card className="p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="w-full max-w-xl space-y-2">
              <Label className="text-slate-700">Barbearia selecionada</Label>
              <Select value={selectedShopId} onValueChange={setSelectedShopId} disabled={loadingList || savingShop}>
                <SelectTrigger className="mt-1 w-full bg-slate-50 border-slate-200">
                  <SelectValue placeholder="Selecione uma barbearia" />
                </SelectTrigger>
                <SelectContent>
                  {shops.map((item) => (
                    <SelectItem key={item.id} value={String(item.id)}>
                      {item.nome}{item.cidade ? ` • ${item.cidade}` : ""}
                    </SelectItem>
                  ))}
                  <SelectItem value="new">Nova barbearia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="button"
              variant="outline"
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
              onClick={() => setSelectedShopId("new")}
              disabled={savingShop}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Nova barbearia
            </Button>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="barbershop" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="barbershop">Barbearia</TabsTrigger>
            <TabsTrigger value="horarios">Horários</TabsTrigger>
            <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
            <TabsTrigger value="seguranca">Segurança</TabsTrigger>
          </TabsList>

          {/* Barbershop Settings */}
          <TabsContent value="barbershop" className="space-y-6">
            <Card className="p-6">
              <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Building className="w-5 h-5" />
                Informações da Barbearia
              </h3>

              <div className="space-y-5">
                <div className="rounded-2xl border border-blue-100 bg-blue-50/80 p-5">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Link único</p>
                      <h4 className="text-xl font-bold text-slate-900">Cada barbearia recebe um endereço público próprio</h4>
                      <p className="max-w-2xl text-sm leading-7 text-slate-600">
                        O <strong>slug</strong> é o trecho final do link da barbearia. Exemplo: se o slug for{" "}
                        <span className="font-semibold text-slate-900">barbearia-do-joao</span>, o link público fica{" "}
                        <span className="font-semibold text-slate-900">{publicBaseUrl}/barbearia-do-joao</span>.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm lg:min-w-[280px]">
                      <div className="flex items-center gap-2 text-blue-700">
                        <LinkIcon className="h-4 w-4" />
                        <p className="text-sm font-semibold">Slug atual</p>
                      </div>
                      <p className="mt-3 break-all text-lg font-bold text-slate-900">
                        {slug || "Será gerado automaticamente ao salvar"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50/90 p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Link público da barbearia</p>
                      <p className="break-all text-base font-semibold text-slate-900">
                        {publicBookingLink || "Salve a barbearia para gerar o link público"}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCopyLink}
                        disabled={!publicBookingLink}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copiar link
                      </Button>
                      <Button
                        type="button"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => window.open(publicBookingLink, "_blank", "noopener,noreferrer")}
                        disabled={!publicBookingLink}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Abrir página pública
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-700">Nome da Barbearia</Label>
                    <Input
                      value={form.nome}
                      onChange={(event) => updateField("nome", event.target.value)}
                      className="mt-2 bg-slate-50 border-slate-200"
                      disabled={loadingShop}
                    />
                  </div>
                  <div>
                    <Label className="text-slate-700">Instagram</Label>
                    <Input
                      value={form.instagram}
                      onChange={(event) => updateField("instagram", event.target.value)}
                      className="mt-2 bg-slate-50 border-slate-200"
                      disabled={loadingShop}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-700">Telefone</Label>
                    <Input
                      value={form.telefone}
                      onChange={(event) => updateField("telefone", event.target.value)}
                      className="mt-2 bg-slate-50 border-slate-200"
                      disabled={loadingShop}
                    />
                  </div>
                  <div>
                    <Label className="text-slate-700">Endereço</Label>
                    <Input
                      value={form.endereco}
                      onChange={(event) => updateField("endereco", event.target.value)}
                      className="mt-2 bg-slate-50 border-slate-200"
                      disabled={loadingShop}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-slate-700">Cidade</Label>
                    <Input
                      value={form.cidade}
                      onChange={(event) => updateField("cidade", event.target.value)}
                      className="mt-2 bg-slate-50 border-slate-200"
                      disabled={loadingShop}
                    />
                  </div>
                  <div>
                    <Label className="text-slate-700">Abre às</Label>
                    <Input
                      type="time"
                      value={form.horarioAbertura}
                      onChange={(event) => updateField("horarioAbertura", event.target.value)}
                      className="mt-2 bg-slate-50 border-slate-200"
                      disabled={loadingShop}
                    />
                  </div>
                  <div>
                    <Label className="text-slate-700">Fecha às</Label>
                    <Input
                      type="time"
                      value={form.horarioFechamento}
                      onChange={(event) => updateField("horarioFechamento", event.target.value)}
                      className="mt-2 bg-slate-50 border-slate-200"
                      disabled={loadingShop}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-700">WhatsApp Link</Label>
                    <Input
                      value={form.whatsappLink}
                      onChange={(event) => updateField("whatsappLink", event.target.value)}
                      className="mt-2 bg-slate-50 border-slate-200"
                      placeholder="https://wa.me/5511999999999"
                      disabled={loadingShop}
                    />
                  </div>
                  <div>
                    <Label className="text-slate-700">Taxa de Reserva Padrão</Label>
                    <Input
                      type="number"
                      min="0"
                      value={form.taxaReservaPadrao}
                      onChange={(event) => updateField("taxaReservaPadrao", Number(event.target.value || 0))}
                      className="mt-2 bg-slate-50 border-slate-200"
                      disabled={loadingShop}
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-slate-700">Descrição</Label>
                  <Textarea
                    value={form.descricao}
                    onChange={(event) => updateField("descricao", event.target.value)}
                    className="mt-2 min-h-28 bg-slate-50 border-slate-200 text-slate-900"
                    rows={4}
                    disabled={loadingShop}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div>
                      <p className="font-medium text-slate-900">Barbearia ativa</p>
                      <p className="text-sm text-slate-600">Se estiver inativa, a página pública não deve aparecer.</p>
                    </div>
                    <Switch
                      checked={form.ativa}
                      onCheckedChange={(checked) => updateField("ativa", checked)}
                      disabled={loadingShop}
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div>
                      <p className="font-medium text-slate-900">Aceitar reserva com Pix</p>
                      <p className="text-sm text-slate-600">Ative quando quiser proteger horários com sinal.</p>
                    </div>
                    <Switch
                      checked={form.aceitaReservaPix}
                      onCheckedChange={(checked) => updateField("aceitaReservaPix", checked)}
                      disabled={loadingShop}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleSaveBarbearia}
                    disabled={savingShop || loadingShop}
                  >
                    {savingShop ? "Salvando..." : shopId ? "Salvar Alterações" : "Criar Barbearia"}
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Horários */}
          <TabsContent value="horarios" className="space-y-6">
            <Card className="p-6">
              <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Horário de Funcionamento
              </h3>

              <div className="space-y-4">
                {["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"].map(
                  (day, idx) => (
                    <div key={day} className="flex items-center gap-4 pb-4 border-b border-slate-200 last:border-0">
                      <div className="w-24 font-medium text-slate-700">{day}</div>
                      <div className="flex-1 flex items-center gap-2">
                        <Input
                          type="time"
                          defaultValue={idx === 6 ? "" : "09:00"}
                          disabled={idx === 6}
                          className="w-24 bg-slate-50 border-slate-200"
                        />
                        <span className="text-slate-400">até</span>
                        <Input
                          type="time"
                          defaultValue={idx === 6 ? "" : "18:00"}
                          disabled={idx === 6}
                          className="w-24 bg-slate-50 border-slate-200"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch defaultChecked={idx !== 6} />
                        <span className="text-sm text-slate-600">{idx === 6 ? "Fechado" : "Aberto"}</span>
                      </div>
                    </div>
                  )
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <Button className="bg-blue-600 hover:bg-blue-700">Salvar Horários</Button>
              </div>
            </Card>
          </TabsContent>

          {/* Notificações */}
          <TabsContent value="notificacoes" className="space-y-6">
            <Card className="p-6">
              <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Preferências de Notificação
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">Novos Agendamentos</p>
                    <p className="text-sm text-slate-600">Receba notificações quando novos agendamentos forem feitos</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">Cancelamentos</p>
                    <p className="text-sm text-slate-600">Receba notificações de cancelamentos</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">Lembretes de Agendamentos</p>
                    <p className="text-sm text-slate-600">Receba lembretes antes dos agendamentos</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">Relatórios Semanais</p>
                    <p className="text-sm text-slate-600">Receba relatórios de desempenho semanalmente</p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Segurança */}
          <TabsContent value="seguranca" className="space-y-6">
            <Card className="p-6">
              <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Segurança e Privacidade
              </h3>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-4">Alterar Senha</h4>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-slate-700">Senha Atual</Label>
                      <Input
                        type="password"
                        className="mt-2 bg-slate-50 border-slate-200"
                        placeholder="••••••••"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-700">Nova Senha</Label>
                      <Input
                        type="password"
                        className="mt-2 bg-slate-50 border-slate-200"
                        placeholder="••••••••"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-700">Confirmar Nova Senha</Label>
                      <Input
                        type="password"
                        className="mt-2 bg-slate-50 border-slate-200"
                        placeholder="••••••••"
                      />
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700">Atualizar Senha</Button>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-4">Autenticação de Dois Fatores</h4>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900">Ativar 2FA</p>
                      <p className="text-sm text-slate-600">Adicione uma camada extra de segurança</p>
                    </div>
                    <Switch defaultChecked={false} />
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-4 text-red-600">Zona de Perigo</h4>
                  <Button variant="destructive">Deletar Conta</Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
