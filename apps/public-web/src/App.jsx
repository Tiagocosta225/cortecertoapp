import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import logo from './assets/logo-cortecertoapp.png'
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  MapPin,
  MessageCircle,
  PhoneCall,
  QrCode,
  Scissors,
  ShieldCheck,
  Star,
} from 'lucide-react'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_PUBLIC_API_BASE_URL || '/api/public'

async function fetchJson(url, options) {
  const response = await fetch(url, options)
  const contentType = response.headers.get('content-type') || ''
  const payload = contentType.includes('application/json') ? await response.json() : null

  if (!response.ok) {
    throw new Error(payload?.message || 'Não foi possível carregar os dados.')
  }

  return payload
}

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value || 0))
}

function formatDateLabel(dateString) {
  const date = new Date(`${dateString}T00:00:00`)
  return {
    short: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
    dayMonth: date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
  }
}

function getNextDays(total = 4) {
  return Array.from({ length: total }, (_, index) => {
    const date = new Date()
    date.setDate(date.getDate() + index)
    return date.toISOString().slice(0, 10)
  })
}

function MarketingHome() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-8 md:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4 border-b border-border pb-6">
          <img src={logo} alt="CorteCertoApp" className="h-14 w-auto object-contain md:h-16" />
          <div className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#beneficios">Benefícios</a>
            <a href="#como-funciona">Como funciona</a>
            <a href="#contato">Contato</a>
          </div>
        </header>

        <main className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="space-y-6">
            <Badge className="bg-primary text-primary-foreground hover:bg-primary">
              Link único para cada barbearia
            </Badge>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold leading-tight md:text-6xl">
                CorteCertoApp organiza a agenda da barbearia sem complicação.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                Cada barbearia recebe seu próprio link de agendamento, com serviços, horários e confirmação rápida em
                um fluxo simples para o cliente.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to="/barbearia-do-joao">
                  Ver exemplo de link
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#como-funciona">Entender o fluxo</a>
              </Button>
            </div>

            <div id="beneficios" className="grid gap-4 sm:grid-cols-3">
              <Card className="border-border">
                <CardContent className="space-y-3 p-5">
                  <CalendarDays className="h-6 w-6 text-primary" />
                  <h2 className="text-lg font-semibold">Agenda simples</h2>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Cliente entra no link da barbearia e escolhe serviço, dia e horário.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="space-y-3 p-5">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                  <h2 className="text-lg font-semibold">Reserva protegida</h2>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Taxa de reserva opcional por Pix para reduzir faltas em horários disputados.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="space-y-3 p-5">
                  <MessageCircle className="h-6 w-6 text-primary" />
                  <h2 className="text-lg font-semibold">Confirmação rápida</h2>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Cliente pode confirmar direto pelo WhatsApp da barbearia.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section id="como-funciona">
            <Card className="border-border shadow-lg">
              <CardContent className="space-y-5 p-6">
                <div className="flex items-center gap-3">
                  <img src={logo} alt="CorteCertoApp" className="h-12 w-auto object-contain" />
                  <div>
                    <p className="text-sm text-muted-foreground">Exemplo de endereço</p>
                    <p className="font-semibold">cortecerto.app/barbearia-do-joao</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="rounded-lg bg-secondary p-4">
                    <p className="font-medium">1. A barbearia compartilha o link único</p>
                  </div>
                  <div className="rounded-lg bg-secondary p-4">
                    <p className="font-medium">2. O cliente escolhe serviço e horário</p>
                  </div>
                  <div className="rounded-lg bg-secondary p-4">
                    <p className="font-medium">3. A reserva é confirmada pela API pública da barbearia</p>
                  </div>
                </div>

                <div className="rounded-xl border border-border p-4">
                  <p className="text-sm text-muted-foreground">Fluxo recomendado</p>
                  <p className="mt-2 text-base font-semibold">
                    Um link por barbearia, sem login obrigatório para o cliente.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </div>
  )
}

function BookingLinkPage() {
  const { slug = '' } = useParams()
  const [shop, setShop] = useState(null)
  const [selectedDate, setSelectedDate] = useState(getNextDays(4)[0])
  const [agenda, setAgenda] = useState(null)
  const [selectedServiceId, setSelectedServiceId] = useState('')
  const [selectedSlot, setSelectedSlot] = useState('')
  const [loading, setLoading] = useState(true)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [form, setForm] = useState({
    nome: '',
    telefone: '',
    email: '',
  })

  useEffect(() => {
    let cancelled = false

    async function loadShop() {
      try {
        setLoading(true)
        setError('')
        const payload = await fetchJson(`${API_BASE_URL}/barbearias/${slug}`)
        if (cancelled) return
        setShop(payload)
        if (payload.servicos?.length) {
          setSelectedServiceId(String(payload.servicos[0].id))
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadShop()
    return () => {
      cancelled = true
    }
  }, [slug])

  useEffect(() => {
    if (!shop || !selectedDate) return
    let cancelled = false

    async function loadAgenda() {
      try {
        const payload = await fetchJson(`${API_BASE_URL}/barbearias/${slug}/agenda?date=${selectedDate}`)
        if (cancelled) return
        setAgenda(payload)
        setSelectedSlot('')
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message)
        }
      }
    }

    loadAgenda()
    return () => {
      cancelled = true
    }
  }, [shop, slug, selectedDate])

  async function handleBookingSubmit(event) {
    event.preventDefault()
    if (!selectedServiceId || !selectedSlot) return

    const selectedService = shop?.servicos?.find((item) => String(item.id) === String(selectedServiceId))

    try {
      setBookingLoading(true)
      setError('')
      setSuccessMessage('')

      await fetchJson(`${API_BASE_URL}/barbearias/${slug}/agendamentos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: form.nome,
          telefone: form.telefone,
          email: form.email || null,
          servicoId: Number(selectedServiceId),
          data: selectedDate,
          horario: selectedSlot,
          deposito: Number(selectedService?.depositoAntecipado || 0),
        }),
      })

      setSuccessMessage('Agendamento criado com sucesso. Agora é só confirmar com a barbearia.')
      const refreshedAgenda = await fetchJson(`${API_BASE_URL}/barbearias/${slug}/agenda?date=${selectedDate}`)
      setAgenda(refreshedAgenda)
      setSelectedSlot('')
      setForm({
        nome: '',
        telefone: '',
        email: '',
      })
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
        <Card className="w-full max-w-xl border-border">
          <CardContent className="p-8 text-center text-muted-foreground">Carregando barbearia...</CardContent>
        </Card>
      </div>
    )
  }

  if (error && !shop) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
        <Card className="w-full max-w-xl border-border">
          <CardContent className="space-y-4 p-8 text-center">
            <Badge variant="secondary">Link não encontrado</Badge>
            <h1 className="text-3xl font-bold">Essa barbearia não está disponível.</h1>
            <p className="text-muted-foreground">{error}</p>
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/">Voltar para o início</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const selectedService = shop?.servicos?.find((item) => String(item.id) === String(selectedServiceId))
  const days = getNextDays(4)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 lg:px-8">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
          <div className="flex items-center gap-4">
            <img src={logo} alt="CorteCertoApp" className="h-14 w-auto object-contain" />
            <div>
              <h1 className="text-2xl font-bold md:text-3xl">{shop.nome}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-primary" />
                  {shop.cidade || 'Cidade não informada'}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  Link público ativo
                </span>
              </div>
            </div>
          </div>

          <Button asChild variant="outline">
            <Link to="/">Voltar</Link>
          </Button>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="space-y-6">
            <Card className="border-border">
              <CardContent className="space-y-5 p-6">
                <Badge className="bg-primary text-primary-foreground hover:bg-primary">
                  Link único da barbearia
                </Badge>
                <div>
                  <h2 className="text-3xl font-bold md:text-4xl">
                    {shop.descricao || 'Escolha o serviço ideal e reserve seu horário em poucos toques.'}
                  </h2>
                  <p className="mt-3 text-base leading-7 text-muted-foreground">
                    Atendimento direto da agenda pública da barbearia.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {shop.servicos.map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => setSelectedServiceId(String(service.id))}
                      className={`rounded-xl border p-4 text-left transition ${
                        String(service.id) === String(selectedServiceId)
                          ? 'border-primary bg-secondary'
                          : 'border-border bg-card hover:border-primary/60'
                      }`}
                    >
                      <p className="font-semibold">{service.nome}</p>
                      <p className="mt-2 text-sm text-muted-foreground">{service.duracaoMin} min</p>
                      <p className="mt-2 text-lg font-bold text-primary">{formatCurrency(service.preco)}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="space-y-5 p-6">
                <div>
                  <h3 className="text-2xl font-bold">Escolha o melhor dia</h3>
                  <p className="text-sm text-muted-foreground">Disponibilidade atual da agenda</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {days.map((day) => {
                    const formatted = formatDateLabel(day)
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => setSelectedDate(day)}
                        className={`rounded-xl border p-4 text-left transition ${
                          day === selectedDate
                            ? 'border-primary bg-secondary'
                            : 'border-border bg-card hover:border-primary/60 hover:bg-secondary'
                        }`}
                      >
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">{formatted.short}</p>
                        <p className="mt-2 text-xl font-bold">{formatted.dayMonth}</p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {day === selectedDate ? 'Dia selecionado' : 'Toque para ver horários'}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-6">
            <Card className="border-border">
              <CardContent className="space-y-5 p-6">
                <div>
                  <h3 className="text-2xl font-bold">Horários disponíveis</h3>
                  <p className="text-sm text-muted-foreground">Selecione o slot ideal para o atendimento</p>
                </div>

                <div className="space-y-3">
                  {agenda?.slots?.map((slot) => (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={!slot.disponivel}
                      onClick={() => slot.disponivel && setSelectedSlot(slot.time)}
                      className={`flex w-full items-center justify-between rounded-xl border px-4 py-4 text-left transition ${
                        !slot.disponivel
                          ? 'cursor-not-allowed border-border bg-muted text-muted-foreground opacity-60'
                          : selectedSlot === slot.time
                            ? 'border-primary bg-secondary'
                            : 'border-border bg-card hover:border-primary/60 hover:bg-secondary'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Clock3 className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-semibold">{slot.time}</p>
                          <p className="text-sm text-muted-foreground">{slot.tag}</p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="space-y-5 p-6">
                <Badge variant="secondary" className="gap-2">
                  <QrCode className="h-4 w-4" />
                  Reserva protegida
                </Badge>
                <div>
                  <h3 className="text-2xl font-bold">Confirme e finalize o horário</h3>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    Alguns serviços podem usar uma taxa de reserva para proteger o horário escolhido.
                  </p>
                </div>

                <div className="rounded-xl bg-secondary p-4">
                  <p className="font-semibold">{selectedService?.nome || 'Selecione um serviço'}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Reserva antecipada: {formatCurrency(selectedService?.depositoAntecipado || shop.taxaReservaPadrao || 0)}
                  </p>
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}
                {successMessage && <p className="text-sm text-green-700">{successMessage}</p>}

                <form className="space-y-4" onSubmit={handleBookingSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome</Label>
                    <Input
                      id="nome"
                      value={form.nome}
                      onChange={(event) => setForm((current) => ({ ...current, nome: event.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      value={form.telefone}
                      onChange={(event) => setForm((current) => ({ ...current, telefone: event.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                    />
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button
                      type="submit"
                      disabled={bookingLoading || !selectedServiceId || !selectedSlot}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      {bookingLoading ? 'Confirmando...' : 'Criar agendamento'}
                    </Button>
                    {shop.whatsappLink && (
                      <Button asChild variant="outline">
                        <a href={shop.whatsappLink} target="_blank" rel="noreferrer">
                          <PhoneCall className="mr-2 h-4 w-4" />
                          Falar com a barbearia
                        </a>
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MarketingHome />} />
        <Route path="/:slug" element={<BookingLinkPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
