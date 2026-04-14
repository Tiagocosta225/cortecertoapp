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
import { Textarea } from "@/components/ui/textarea";
import { CalendarDays, ChevronLeft, ChevronRight, Clock, Scissors, User } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const SELECTED_BARBERSHOP_STORAGE_KEY = "cortecerto.selectedBarbershopId";
const CANCELLED_STATUSES = new Set(["cancelado"]);

type Barbearia = {
  id: number;
  nome: string;
  slug?: string;
  cidade?: string | null;
  horarioAbertura: string;
  horarioFechamento: string;
};

type Cliente = {
  id: number;
  nome: string;
  telefone: string;
  barbeariaId: number;
};

type Servico = {
  id: number;
  nome: string;
  preco: number;
  duracaoMin: number;
  barbeariaId: number;
  ativo: boolean;
};

type Agendamento = {
  id: number;
  data: string;
  status: string;
  clienteId: number;
  barbeariaId: number;
  servicoId: number;
  valorServico: number;
  origem: string;
  barbeiroNome?: string | null;
  observacoes?: string | null;
  cliente?: Cliente;
  servico?: Servico;
};

const DEFAULT_FORM = {
  clienteId: "",
  servicoId: "",
  time: "",
  barbeiroNome: "",
  observacoes: "",
};

function toDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseLocalDate(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
}

function toMinutes(time: string) {
  const [hour, minute] = String(time || "00:00").split(":").map(Number);
  return hour * 60 + minute;
}

function formatTime(value: string | Date) {
  return new Date(value).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value || 0));
}

function buildTimeSlots(openTime = "09:00", closeTime = "18:00") {
  const slots: string[] = [];
  const open = toMinutes(openTime);
  const close = toMinutes(closeTime);

  for (let current = open; current < close; current += 30) {
    const hour = String(Math.floor(current / 60)).padStart(2, "0");
    const minute = String(current % 60).padStart(2, "0");
    slots.push(`${hour}:${minute}`);
  }

  return slots;
}

function getMonthDays(reference: Date) {
  const year = reference.getFullYear();
  const month = reference.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: Array<Date | null> = Array.from({ length: firstDay.getDay() }, () => null);

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    days.push(new Date(year, month, day));
  }

  return days;
}

async function parseResponse(response: Response) {
  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    throw new Error(payload?.message || payload?.error || "Não foi possível carregar a agenda.");
  }

  return payload;
}

export default function Agenda() {
  const [shops, setShops] = useState<Barbearia[]>([]);
  const [selectedShopId, setSelectedShopId] = useState("");
  const [selectedDate, setSelectedDate] = useState(toDateInput(new Date()));
  const [appointments, setAppointments] = useState<Agendamento[]>([]);
  const [clients, setClients] = useState<Cliente[]>([]);
  const [services, setServices] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Agendamento | null>(null);
  const [form, setForm] = useState(DEFAULT_FORM);

  const selectedShop = shops.find((shop) => String(shop.id) === selectedShopId);
  const selectedDateObject = parseLocalDate(selectedDate);
  const calendarDays = getMonthDays(selectedDateObject);
  const timeSlots = useMemo(
    () => buildTimeSlots(selectedShop?.horarioAbertura, selectedShop?.horarioFechamento),
    [selectedShop?.horarioAbertura, selectedShop?.horarioFechamento]
  );

  const shopClients = useMemo(
    () => clients.filter((client) => String(client.barbeariaId) === selectedShopId),
    [clients, selectedShopId]
  );

  const shopServices = useMemo(
    () => services.filter((service) => String(service.barbeariaId) === selectedShopId && service.ativo),
    [selectedShopId, services]
  );

  const activeAppointments = useMemo(
    () => appointments.filter((item) => !CANCELLED_STATUSES.has(item.status)),
    [appointments]
  );

  const appointmentsByTime = useMemo(() => {
    const map = new Map<string, Agendamento>();
    activeAppointments.forEach((appointment) => {
      map.set(formatTime(appointment.data), appointment);
    });
    return map;
  }, [activeAppointments]);

  const selectedService = shopServices.find((service) => String(service.id) === form.servicoId);
  const availableCreateSlots = useMemo(
    () =>
      timeSlots.filter((slot) => {
        const start = toMinutes(slot);
        const end = start + Number(selectedService?.duracaoMin || 30);
        const close = toMinutes(selectedShop?.horarioFechamento || "18:00");
        if (end > close) return false;

        return !activeAppointments.some((appointment) => {
          const appointmentStart = toMinutes(formatTime(appointment.data));
          const appointmentEnd = appointmentStart + Number(appointment.servico?.duracaoMin || 30);
          return start < appointmentEnd && appointmentStart < end;
        });
      }),
    [activeAppointments, selectedService?.duracaoMin, selectedShop?.horarioFechamento, timeSlots]
  );

  const loadAppointments = useCallback(async (shopId: string, date: string) => {
    if (!shopId) return;

    setLoadingAppointments(true);
    try {
      const params = new URLSearchParams({ barbeariaId: shopId, date });
      const response = await fetch(`/api/agendamentos?${params.toString()}`);
      const payload = await parseResponse(response);
      setAppointments(Array.isArray(payload) ? payload : []);
    } finally {
      setLoadingAppointments(false);
    }
  }, []);

  const loadReferenceData = useCallback(async () => {
    setLoading(true);
    try {
      const [shopsResponse, clientsResponse, servicesResponse] = await Promise.all([
        fetch("/api/barbearias"),
        fetch("/api/clientes"),
        fetch("/api/servicos"),
      ]);

      const [shopsPayload, clientsPayload, servicesPayload] = await Promise.all([
        parseResponse(shopsResponse),
        parseResponse(clientsResponse),
        parseResponse(servicesResponse),
      ]);

      const shopList = Array.isArray(shopsPayload) ? shopsPayload : [];
      setShops(shopList);
      setClients(Array.isArray(clientsPayload) ? clientsPayload : []);
      setServices(Array.isArray(servicesPayload) ? servicesPayload : []);

      if (shopList.length) {
        const storedId = window.localStorage.getItem(SELECTED_BARBERSHOP_STORAGE_KEY);
        const preferredShop = shopList.find((shop) => String(shop.id) === storedId) || shopList[0];
        setSelectedShopId(String(preferredShop.id));
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao carregar a agenda.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReferenceData();
  }, [loadReferenceData]);

  useEffect(() => {
    if (!selectedShopId) return;

    window.localStorage.setItem(SELECTED_BARBERSHOP_STORAGE_KEY, selectedShopId);
    loadAppointments(selectedShopId, selectedDate).catch((error) => {
      toast.error(error instanceof Error ? error.message : "Falha ao carregar agendamentos.");
    });
  }, [loadAppointments, selectedDate, selectedShopId]);

  useEffect(() => {
    setForm((current) => ({
      ...current,
      servicoId: shopServices.some((service) => String(service.id) === current.servicoId) ? current.servicoId : "",
      clienteId: shopClients.some((client) => String(client.id) === current.clienteId) ? current.clienteId : "",
      time: availableCreateSlots.includes(current.time) ? current.time : "",
    }));
  }, [availableCreateSlots, shopClients, shopServices]);

  function openCreateDialog(time = "") {
    setForm({
      ...DEFAULT_FORM,
      time,
      servicoId: shopServices[0] ? String(shopServices[0].id) : "",
      clienteId: shopClients[0] ? String(shopClients[0].id) : "",
    });
    setDialogOpen(true);
  }

  async function handleCreateAppointment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedShopId || !form.clienteId || !form.servicoId || !form.time) {
      toast.error("Selecione cliente, serviço e horário.");
      return;
    }

    try {
      setSaving(true);
      const service = shopServices.find((item) => String(item.id) === form.servicoId);
      const response = await fetch("/api/agendamentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clienteId: Number(form.clienteId),
          servicoId: Number(form.servicoId),
          barbeariaId: Number(selectedShopId),
          data: selectedDate,
          time: form.time,
          status: "confirmado",
          valorServico: Number(service?.preco || 0),
          origem: "manual",
          barbeiroNome: form.barbeiroNome.trim() || null,
          observacoes: form.observacoes.trim() || null,
        }),
      });

      await parseResponse(response);
      await loadAppointments(selectedShopId, selectedDate);
      setDialogOpen(false);
      toast.success("Agendamento criado.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao criar agendamento.");
    } finally {
      setSaving(false);
    }
  }

  async function cancelAppointment(appointment: Agendamento) {
    try {
      setSaving(true);
      const response = await fetch(`/api/agendamentos/${appointment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelado" }),
      });
      await parseResponse(response);
      await loadAppointments(selectedShopId, selectedDate);
      setSelectedAppointment((current) =>
        current?.id === appointment.id ? { ...current, status: "cancelado" } : current
      );
      toast.success("Agendamento cancelado.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao cancelar agendamento.");
    } finally {
      setSaving(false);
    }
  }

  function moveMonth(offset: number) {
    const next = parseLocalDate(selectedDate);
    next.setMonth(next.getMonth() + offset, 1);
    setSelectedDate(toDateInput(next));
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Agenda</h1>
            <p className="mt-1 text-slate-600">Calendário real com os agendamentos salvos no banco.</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => openCreateDialog()} disabled={!selectedShopId || !shopClients.length || !shopServices.length}>
            Novo agendamento
          </Button>
        </div>

        <Card className="p-5">
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:items-end">
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
            <div className="space-y-2">
              <Label>Data</Label>
              <Input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} className="border-slate-200 bg-slate-50" />
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">
                {selectedShop?.horarioAbertura || "--:--"} até {selectedShop?.horarioFechamento || "--:--"}
              </p>
              <p>horário cadastrado da barbearia</p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="p-6 lg:col-span-1">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900">
                  {selectedDateObject.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
                </h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => moveMonth(-1)}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => moveMonth(1)}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center text-sm">
                {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
                  <div key={day} className="py-2 font-semibold text-slate-600">
                    {day}
                  </div>
                ))}
                {calendarDays.map((day, index) => {
                  const dateValue = day ? toDateInput(day) : "";
                  const isSelected = dateValue === selectedDate;
                  const isToday = dateValue === toDateInput(new Date());
                  return (
                    <button
                      key={`${dateValue}-${index}`}
                      type="button"
                      disabled={!day}
                      onClick={() => day && setSelectedDate(dateValue)}
                      className={`min-h-10 rounded-lg font-medium transition-colors ${
                        isSelected
                          ? "bg-blue-600 text-white"
                          : isToday
                            ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                            : day
                              ? "text-slate-600 hover:bg-slate-100"
                              : "cursor-default"
                      }`}
                    >
                      {day?.getDate() || ""}
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>

          <Card className="p-6 lg:col-span-2">
            <div className="space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-bold text-slate-900">
                    {selectedDateObject.toLocaleDateString("pt-BR", {
                      weekday: "long",
                      day: "2-digit",
                      month: "long",
                    })}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {activeAppointments.length} agendamento(s) confirmado(s)
                  </p>
                </div>
                {loadingAppointments && <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100">Carregando</Badge>}
              </div>

              {!shops.length && !loading ? (
                <div className="rounded-lg border border-dashed border-slate-200 p-8 text-center text-slate-600">
                  Cadastre uma barbearia para liberar a agenda.
                </div>
              ) : (
                <div className="max-h-[560px] space-y-2 overflow-y-auto pr-1">
                  {timeSlots.map((time) => {
                    const appointment = appointmentsByTime.get(time);
                    return (
                      <div key={time} className="flex items-start gap-3">
                        <div className="w-16 pt-3 text-sm font-medium text-slate-600">{time}</div>
                        <div className="flex-1">
                          {appointment ? (
                            <button
                              type="button"
                              onClick={() => setSelectedAppointment(appointment)}
                              className="w-full rounded-lg border border-blue-200 bg-blue-50 p-4 text-left transition hover:bg-blue-100"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div>
                                  <p className="font-semibold text-slate-900">
                                    {appointment.cliente?.nome || "Cliente não informado"}
                                  </p>
                                  <p className="mt-1 text-sm text-slate-600">
                                    {appointment.servico?.nome || "Serviço"} • {appointment.servico?.duracaoMin || 30} min
                                  </p>
                                </div>
                                <Badge className="bg-blue-600 hover:bg-blue-600">{appointment.status}</Badge>
                              </div>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => openCreateDialog(time)}
                              className="h-12 w-full rounded-lg border border-dashed border-slate-200 bg-slate-50 text-left text-sm text-slate-400 transition hover:border-blue-200 hover:bg-blue-50 hover:px-4 hover:text-blue-700"
                            >
                              <span className="sr-only">Criar agendamento às {time}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </Card>
        </div>

        {selectedAppointment && (
          <Card className="border-l-4 border-blue-600 bg-slate-50 p-6">
            <div className="space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="font-bold text-slate-900">Detalhes do agendamento</h3>
                <Badge className={CANCELLED_STATUSES.has(selectedAppointment.status) ? "bg-slate-100 text-slate-700 hover:bg-slate-100" : "bg-green-100 text-green-700 hover:bg-green-100"}>
                  {selectedAppointment.status}
                </Badge>
              </div>
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <p className="text-xs font-medium text-slate-600">Cliente</p>
                  <p className="text-sm font-semibold text-slate-900">{selectedAppointment.cliente?.nome || "-"}</p>
                  <p className="text-xs text-slate-600">{selectedAppointment.cliente?.telefone || ""}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-600">Serviço</p>
                  <p className="text-sm font-semibold text-slate-900">{selectedAppointment.servico?.nome || "-"}</p>
                  <p className="text-xs text-slate-600">{formatCurrency(Number(selectedAppointment.valorServico || selectedAppointment.servico?.preco || 0))}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-600">Horário</p>
                  <p className="text-sm font-semibold text-slate-900">{formatTime(selectedAppointment.data)}</p>
                  <p className="text-xs text-slate-600">{selectedDate}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-600">Origem</p>
                  <p className="text-sm font-semibold text-slate-900">{selectedAppointment.origem}</p>
                  <p className="text-xs text-slate-600">{selectedAppointment.barbeiroNome || "Sem barbeiro definido"}</p>
                </div>
              </div>
              {selectedAppointment.observacoes && (
                <p className="rounded-lg bg-white p-3 text-sm text-slate-600">{selectedAppointment.observacoes}</p>
              )}
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  onClick={() => cancelAppointment(selectedAppointment)}
                  disabled={saving || CANCELLED_STATUSES.has(selectedAppointment.status)}
                >
                  Cancelar agendamento
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <form onSubmit={handleCreateAppointment} className="space-y-5">
            <DialogHeader>
              <DialogTitle>Novo agendamento</DialogTitle>
              <DialogDescription>
                O horário é validado pelo expediente real da barbearia e pelos agendamentos já salvos.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Cliente</Label>
                <Select value={form.clienteId} onValueChange={(value) => setForm((current) => ({ ...current, clienteId: value }))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {shopClients.map((client) => (
                      <SelectItem key={client.id} value={String(client.id)}>
                        {client.nome} • {client.telefone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Serviço</Label>
                <Select value={form.servicoId} onValueChange={(value) => setForm((current) => ({ ...current, servicoId: value, time: "" }))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um serviço" />
                  </SelectTrigger>
                  <SelectContent>
                    {shopServices.map((service) => (
                      <SelectItem key={service.id} value={String(service.id)}>
                        {service.nome} • {service.duracaoMin} min
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Data</Label>
                <Input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Horário disponível</Label>
                <Select value={form.time} onValueChange={(value) => setForm((current) => ({ ...current, time: value }))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um horário" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCreateSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Barbeiro</Label>
                <Input value={form.barbeiroNome} onChange={(event) => setForm((current) => ({ ...current, barbeiroNome: event.target.value }))} placeholder="Opcional" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Observações</Label>
                <Textarea value={form.observacoes} onChange={(event) => setForm((current) => ({ ...current, observacoes: event.target.value }))} placeholder="Opcional" />
              </div>
            </div>

            {!shopClients.length && (
              <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
                Cadastre ou receba pelo chat ao menos um cliente para criar agendamentos manuais.
              </p>
            )}
            {!shopServices.length && (
              <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
                Cadastre ao menos um serviço ativo para liberar horários.
              </p>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Fechar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={saving || !availableCreateSlots.length}>
                {saving ? "Salvando..." : "Criar agendamento"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
