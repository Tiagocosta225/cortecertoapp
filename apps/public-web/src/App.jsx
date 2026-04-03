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
  CheckCircle2,
  Clock3,
  CreditCard,
  Gem,
  Instagram,
  LayoutDashboard,
  MapPin,
  MessageCircle,
  PhoneCall,
  QrCode,
  Scissors,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  UserRound,
  Wallet,
} from 'lucide-react'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_PUBLIC_API_BASE_URL || '/api/public'

const marketingHighlights = [
  {
    icon: CalendarDays,
    title: 'Agenda online 24h',
    description: 'O cliente escolhe o melhor horário sozinho, sem mensagens perdidas e sem precisar baixar app.',
  },
  {
    icon: ShieldCheck,
    title: 'Reserva mais protegida',
    description: 'Use sinal por Pix para reduzir faltas e proteger os horários mais disputados da agenda.',
  },
  {
    icon: LayoutDashboard,
    title: 'Operação mais leve',
    description: 'A barbearia centraliza serviços, horários e confirmações em um fluxo simples e previsível.',
  },
]

const marketingMetrics = [
  { value: '1 link', label: 'para cada barbearia vender agenda própria' },
  { value: '4 passos', label: 'do clique até a reserva confirmada' },
  { value: 'Pix + WhatsApp', label: 'no mesmo fluxo de atendimento' },
]

const marketingSteps = [
  'A barbearia compartilha um link único nas redes, Google ou WhatsApp.',
  'O cliente escolhe o serviço, compara horários e agenda em poucos toques.',
  'A confirmação chega com todos os dados do atendimento e contato direto com o estabelecimento.',
]

const marketingFeatures = [
  'Página pública personalizada por barbearia',
  'Serviços com preço, duração e sinal de reserva',
  'Horários atualizados a partir da agenda pública',
  'Confirmação rápida com canal direto no WhatsApp',
]

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
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 md:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4 border-b border-border/80 pb-5">
          <img src={logo} alt="CorteCertoApp" className="h-14 w-auto object-contain md:h-16" />
          <div className="hidden items-center gap-6 text-sm text-muted-foreground lg:flex">
            <a href="#beneficios">Benefícios</a>
            <a href="#como-funciona">Como funciona</a>
            <a href="#destaques">Destaques</a>
            <a href="#contato">Contato</a>
          </div>
        </header>

        <main className="flex-1 py-8 md:py-10">
          <section className="grid items-start gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-4 py-2 text-sm font-medium text-primary">
                <Sparkles className="h-4 w-4" />
                Link único para cada barbearia
              </div>

              <div className="space-y-5">
                <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight md:text-6xl">
                  A agenda pública da sua barbearia com visual profissional, confirmação rápida e menos atrito no
                  atendimento.
                </h1>
                <p className="max-w-3xl text-lg leading-8 text-muted-foreground md:text-xl">
                  O cliente encontra serviços, entende valores, compara horários disponíveis e conclui o agendamento em
                  um fluxo claro. Tudo isso mantendo a identidade da sua marca e um único link para divulgar.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90">
                  <Link to="/barbearia-do-joao">
                    Ver exemplo da barbearia
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-primary/20 bg-white/80 hover:bg-secondary">
                  <a href="#como-funciona">Entender o fluxo</a>
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {marketingMetrics.map((item) => (
                  <Card key={item.label} className="border-border/80 bg-white/85 shadow-sm backdrop-blur">
                    <CardContent className="space-y-2 p-5">
                      <p className="text-2xl font-bold text-primary md:text-3xl">{item.value}</p>
                      <p className="text-sm leading-6 text-muted-foreground">{item.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <section id="como-funciona">
              <Card className="overflow-hidden border-border/70 bg-card/95 shadow-2xl shadow-primary/10">
                <CardContent className="space-y-6 p-0">
                  <div className="bg-[radial-gradient(circle_at_top_left,_rgba(0,102,255,0.18),_transparent_45%),linear-gradient(180deg,#ffffff_0%,#eef4ff_100%)] p-6 md:p-7">
                    <div className="flex items-center gap-3">
                      <img src={logo} alt="CorteCertoApp" className="h-12 w-auto object-contain" />
                      <div>
                        <p className="text-sm text-muted-foreground">Exemplo de endereço</p>
                        <p className="font-semibold">cortecerto.app/barbearia-do-joao</p>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-3 rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Experiência do cliente</span>
                        <Badge className="bg-primary text-primary-foreground hover:bg-primary">Ao vivo</Badge>
                      </div>
                      <div className="grid gap-3">
                        <div className="rounded-xl border border-border/70 bg-background p-4">
                          <p className="text-sm text-muted-foreground">Serviço</p>
                          <p className="mt-1 font-semibold">Corte + barba premium</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="rounded-xl border border-border/70 bg-background p-4">
                            <p className="text-sm text-muted-foreground">Horário</p>
                            <p className="mt-1 font-semibold">19:30</p>
                          </div>
                          <div className="rounded-xl border border-border/70 bg-background p-4">
                            <p className="text-sm text-muted-foreground">Sinal</p>
                            <p className="mt-1 font-semibold text-primary">R$ 10,00</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 px-6 pb-6 md:px-7 md:pb-7">
                    {marketingSteps.map((step, index) => (
                      <div key={step} className="flex gap-4 rounded-2xl border border-border/70 bg-white p-4 shadow-sm">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                          0{index + 1}
                        </div>
                        <p className="text-sm leading-7 text-foreground">{step}</p>
                      </div>
                    ))}

                    <div className="rounded-2xl border border-primary/15 bg-secondary/70 p-5">
                      <p className="text-sm text-muted-foreground">Fluxo recomendado</p>
                      <p className="mt-2 text-base font-semibold">
                        Uma página pública completa para vender melhor o horário antes mesmo do primeiro atendimento.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </section>

          <section id="beneficios" className="mt-10 grid gap-4 md:mt-14 md:grid-cols-3">
            {marketingHighlights.map((item) => {
              const Icon = item.icon
              return (
                <Card key={item.title} className="border-border/80 bg-white/85 shadow-sm">
                  <CardContent className="space-y-4 p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold">{item.title}</h2>
                      <p className="text-sm leading-7 text-muted-foreground">{item.description}</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </section>

          <section id="destaques" className="mt-10 grid gap-6 lg:mt-14 lg:grid-cols-[0.95fr_1.05fr]">
            <Card className="overflow-hidden border-0 bg-[#0A0E27] text-white shadow-2xl shadow-primary/10">
              <CardContent className="space-y-6 p-6 md:p-8">
                <Badge className="w-fit bg-white/12 text-white hover:bg-white/12">Mais clareza para vender</Badge>
                <div className="space-y-3">
                  <h2 className="text-3xl font-bold leading-tight md:text-4xl">
                    Sua página pública deixa o cliente entender valor antes de tocar no WhatsApp.
                  </h2>
                  <p className="text-sm leading-7 text-slate-300 md:text-base">
                    Serviço, duração, sinal, disponibilidade e contato ficam visíveis em uma experiência mais madura e
                    mais confiável para quem está decidindo agendar.
                  </p>
                </div>

                <div className="grid gap-3">
                  {marketingFeatures.map((feature) => (
                    <div key={feature} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <p className="text-sm leading-6 text-slate-200">{feature}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-border/80 bg-white/90 shadow-sm">
                <CardContent className="space-y-3 p-6">
                  <TrendingUp className="h-8 w-8 text-primary" />
                  <h3 className="text-xl font-semibold">Mais contexto na decisão</h3>
                  <p className="text-sm leading-7 text-muted-foreground">
                    A experiência destaca o que está incluso, o tempo do atendimento e a lógica do agendamento.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/80 bg-white/90 shadow-sm">
                <CardContent className="space-y-3 p-6">
                  <Wallet className="h-8 w-8 text-primary" />
                  <h3 className="text-xl font-semibold">Preço e sinal mais visíveis</h3>
                  <p className="text-sm leading-7 text-muted-foreground">
                    O cliente entende rápido o valor do serviço e quando existe reserva antecipada.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/80 bg-white/90 shadow-sm">
                <CardContent className="space-y-3 p-6">
                  <Instagram className="h-8 w-8 text-primary" />
                  <h3 className="text-xl font-semibold">Boa vitrine para divulgar</h3>
                  <p className="text-sm leading-7 text-muted-foreground">
                    O link público fica mais apresentável para bio do Instagram, campanhas e compartilhamento.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/80 bg-white/90 shadow-sm">
                <CardContent className="space-y-3 p-6">
                  <Gem className="h-8 w-8 text-primary" />
                  <h3 className="text-xl font-semibold">Visual mais premium</h3>
                  <p className="text-sm leading-7 text-muted-foreground">
                    A nova composição valoriza a marca da barbearia sem perder a simplicidade do fluxo atual.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section id="contato" className="mt-10 md:mt-14">
            <Card className="border-border/80 bg-white/90 shadow-sm">
              <CardContent className="flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between md:p-8">
                <div className="space-y-2">
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">Contato rápido</p>
                  <h2 className="text-2xl font-bold md:text-3xl">Use um link único para transformar interesse em agenda.</h2>
                  <p className="max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
                    Compartilhe o endereço da barbearia e deixe o cliente reservar sem fricção, com identidade visual,
                    informações claras e confirmação imediata.
                  </p>
                </div>
                <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link to="/barbearia-do-joao">
                    Abrir demonstração
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
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
  const selectedDeposit = selectedService?.depositoAntecipado || shop?.taxaReservaPadrao || 0

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8 lg:px-8">
        <header className="mb-8 overflow-hidden rounded-[2rem] border border-border/70 bg-white/85 shadow-xl shadow-primary/8 backdrop-blur">
          <div className="bg-[radial-gradient(circle_at_top_left,_rgba(0,102,255,0.22),_transparent_36%),linear-gradient(135deg,#ffffff_0%,#edf4ff_100%)] p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl border border-white/70 bg-white/90 p-3 shadow-sm">
                  <img src={logo} alt="CorteCertoApp" className="h-12 w-auto object-contain md:h-14" />
                </div>
                <div>
                  <div className="mb-3 flex flex-wrap gap-2">
                    <Badge className="bg-primary text-primary-foreground hover:bg-primary">Link público ativo</Badge>
                    <Badge variant="secondary" className="bg-white/80 text-foreground">
                      Atendimento direto pela agenda
                    </Badge>
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{shop.nome}</h1>
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-primary" />
                      {shop.cidade || 'Cidade não informada'}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      Atendimento com confirmação rápida
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Scissors className="h-4 w-4 text-primary" />
                      {shop.servicos?.length || 0} serviços disponíveis
                    </span>
                  </div>
                </div>
              </div>

              <Button asChild variant="outline" className="border-primary/15 bg-white/80 hover:bg-secondary">
                <Link to="/">Voltar</Link>
              </Button>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-4">
                <h2 className="max-w-3xl text-3xl font-bold leading-tight md:text-[2.6rem]">
                  {shop.descricao || 'Escolha o serviço ideal, compare horários e finalize o agendamento em poucos toques.'}
                </h2>
                <p className="max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
                  Aqui o cliente encontra uma experiência mais clara para reservar, com detalhes do atendimento,
                  transparência no sinal e acesso rápido ao contato da barbearia.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                <div className="rounded-2xl border border-white/70 bg-white/85 p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary text-primary">
                      <Clock3 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Atendimento</p>
                      <p className="font-semibold">Escolha dia e horário livre</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/70 bg-white/85 p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary text-primary">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Reserva</p>
                      <p className="font-semibold">Sinal a partir de {formatCurrency(selectedDeposit)}</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/70 bg-white/85 p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary text-primary">
                      <PhoneCall className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Suporte</p>
                      <p className="font-semibold">Contato direto com a barbearia</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="space-y-6">
            <Card className="border-border/80 bg-white/90 shadow-sm">
              <CardContent className="space-y-5 p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">Serviços</p>
                    <h2 className="mt-2 text-2xl font-bold md:text-3xl">Escolha a experiência que você quer reservar</h2>
                  </div>
                  <div className="rounded-full border border-primary/15 bg-secondary/70 px-4 py-2 text-sm text-muted-foreground">
                    Preço, duração e sinal visíveis antes de confirmar
                  </div>
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                  {shop.servicos.map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => setSelectedServiceId(String(service.id))}
                      className={`rounded-[1.35rem] border p-5 text-left transition ${
                        String(service.id) === String(selectedServiceId)
                          ? 'border-primary bg-secondary shadow-lg shadow-primary/10'
                          : 'border-border bg-card hover:border-primary/60 hover:bg-secondary/60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-lg font-semibold">{service.nome}</p>
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            Atendimento pensado para manter a agenda clara e o valor visível.
                          </p>
                        </div>
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/80 text-primary shadow-sm">
                          <Scissors className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="mt-5 flex flex-wrap gap-2">
                        <span className="rounded-full bg-white/85 px-3 py-1 text-xs font-medium text-foreground shadow-sm">
                          {service.duracaoMin} min
                        </span>
                        <span className="rounded-full bg-white/85 px-3 py-1 text-xs font-medium text-foreground shadow-sm">
                          Sinal {formatCurrency(service.depositoAntecipado || shop.taxaReservaPadrao || 0)}
                        </span>
                      </div>
                      <p className="mt-5 text-2xl font-bold text-primary">{formatCurrency(service.preco)}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/80 bg-white/90 shadow-sm">
              <CardContent className="space-y-5 p-6">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">Disponibilidade</p>
                  <h3 className="mt-2 text-2xl font-bold">Escolha o melhor dia para seu atendimento</h3>
                  <p className="text-sm text-muted-foreground">Agenda pública atualizada para os próximos dias</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {days.map((day) => {
                    const formatted = formatDateLabel(day)
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => setSelectedDate(day)}
                        className={`rounded-[1.35rem] border p-4 text-left transition ${
                          day === selectedDate
                            ? 'border-primary bg-secondary shadow-lg shadow-primary/10'
                            : 'border-border bg-card hover:border-primary/60 hover:bg-secondary/70'
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

                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-2xl border border-border/70 bg-secondary/60 p-4">
                    <div className="flex items-center gap-3">
                      <CalendarDays className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-semibold">Escolha guiada</p>
                        <p className="text-sm text-muted-foreground">Veja só os dias mais próximos e já disponíveis.</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-secondary/60 p-4">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-semibold">Informação clara</p>
                        <p className="text-sm text-muted-foreground">O valor do sinal aparece antes do envio do pedido.</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-secondary/60 p-4">
                    <div className="flex items-center gap-3">
                      <MessageCircle className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-semibold">Contato imediato</p>
                        <p className="text-sm text-muted-foreground">Continue no WhatsApp caso precise ajustar algo.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-6">
            <Card className="border-border/80 bg-white/90 shadow-sm">
              <CardContent className="space-y-5 p-6">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">Horários</p>
                  <h3 className="mt-2 text-2xl font-bold">Selecione o melhor horário para você</h3>
                  <p className="text-sm text-muted-foreground">Os horários abaixo refletem a agenda pública da barbearia</p>
                </div>

                <div className="space-y-3">
                  {agenda?.slots?.map((slot) => (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={!slot.disponivel}
                      onClick={() => slot.disponivel && setSelectedSlot(slot.time)}
                      className={`flex w-full items-center justify-between rounded-[1.35rem] border px-4 py-4 text-left transition ${
                        !slot.disponivel
                          ? 'cursor-not-allowed border-border bg-muted text-muted-foreground opacity-60'
                          : selectedSlot === slot.time
                            ? 'border-primary bg-secondary shadow-lg shadow-primary/10'
                            : 'border-border bg-card hover:border-primary/60 hover:bg-secondary/70'
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

            <Card className="border-border/80 bg-white/90 shadow-sm">
              <CardContent className="space-y-5 p-6">
                <Badge variant="secondary" className="gap-2">
                  <QrCode className="h-4 w-4" />
                  Reserva protegida
                </Badge>
                <div>
                  <h3 className="text-2xl font-bold">Confirme os dados e finalize a reserva</h3>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    Alguns serviços podem usar uma taxa de reserva para proteger o horário escolhido.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.35rem] bg-secondary p-4">
                    <p className="text-sm text-muted-foreground">Serviço escolhido</p>
                    <p className="mt-2 font-semibold">{selectedService?.nome || 'Selecione um serviço'}</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {selectedService ? `${selectedService.duracaoMin} minutos de atendimento` : 'Escolha um serviço para continuar'}
                    </p>
                  </div>
                  <div className="rounded-[1.35rem] bg-secondary p-4">
                    <p className="text-sm text-muted-foreground">Resumo da reserva</p>
                    <p className="mt-2 font-semibold">
                      {selectedSlot ? `${selectedDate} às ${selectedSlot}` : 'Selecione um horário disponível'}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">Reserva antecipada: {formatCurrency(selectedDeposit)}</p>
                  </div>
                </div>

                <div className="rounded-[1.35rem] border border-border/70 bg-white p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
                      <UserRound className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold">Seus dados só entram no final</p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        Preencha nome, telefone e email para concluir a solicitação. Depois, se quiser, continue a
                        conversa diretamente com a barbearia.
                      </p>
                    </div>
                  </div>
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
