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
    throw new Error(payload?.message || payload?.error || 'Não foi possível carregar os dados.')
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
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
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
  const [step, setStep] = useState('name')
  const [loading, setLoading] = useState(true)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [error, setError] = useState('')
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
        const searchParams = new URLSearchParams({ date: selectedDate })
        if (selectedServiceId) {
          searchParams.set('servicoId', selectedServiceId)
        }

        const payload = await fetchJson(`${API_BASE_URL}/barbearias/${slug}/agenda?${searchParams.toString()}`)
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
  }, [shop, slug, selectedDate, selectedServiceId])

  const selectedService = shop?.servicos?.find((item) => String(item.id) === String(selectedServiceId))
  const days = getNextDays(5)
  const selectedDeposit = selectedService?.depositoAntecipado || shop?.taxaReservaPadrao || 0
  const availableSlots = agenda?.slots?.filter((slot) => slot.disponivel) || []

  const messages = []
  if (shop) {
    messages.push({ from: 'bot', text: `Olá, tudo bem? Sou a assistente virtual da ${shop.nome} e vou cuidar do seu agendamento.` })
    messages.push({ from: 'bot', text: 'Qual o seu nome? Escreva nome e sobrenome, por favor.' })
    if (form.nome) {
      messages.push({ from: 'human', text: form.nome })
      messages.push({ from: 'bot', text: `Como vai, ${form.nome.split(' ')[0]}! Que bom ter você por aqui.` })
    }
    if (step !== 'name') messages.push({ from: 'bot', text: 'Por qual serviço você está procurando?' })
    if (step === 'service' && !shop.servicos?.length) {
      messages.push({ from: 'bot', text: 'Ainda não encontrei serviços ativos cadastrados para essa barbearia.' })
    }
    if (selectedService) {
      messages.push({ from: 'human', text: selectedService.nome })
      messages.push({ from: 'bot', text: `Perfeito. Esse serviço dura ${selectedService.duracaoMin} minutos.` })
    }
    if (['date', 'time', 'phone', 'email', 'confirm', 'done'].includes(step)) {
      messages.push({ from: 'bot', text: 'Certo, qual é o melhor dia para você ser atendido?' })
    }
    if (['time', 'phone', 'email', 'confirm', 'done'].includes(step)) {
      const formatted = formatDateLabel(selectedDate)
      messages.push({ from: 'human', text: `${formatted.short}, ${formatted.dayMonth}` })
      messages.push({ from: 'bot', text: 'Agora escolha um horário disponível para esse serviço.' })
    }
    if (selectedSlot) {
      messages.push({ from: 'human', text: selectedSlot })
      messages.push({ from: 'bot', text: `Ótimo, reservei ${selectedDate} às ${selectedSlot} enquanto finalizamos seus dados.` })
    }
    if (['phone', 'email', 'confirm', 'done'].includes(step)) messages.push({ from: 'bot', text: 'Que bom. Qual é o seu telefone?' })
    if (form.telefone) messages.push({ from: 'human', text: form.telefone })
    if (['email', 'confirm', 'done'].includes(step)) messages.push({ from: 'bot', text: 'Se quiser receber o resumo por e-mail, informe seu e-mail. Você também pode pular.' })
    if (form.email) messages.push({ from: 'human', text: form.email })
    if (['confirm', 'done'].includes(step)) messages.push({ from: 'bot', text: `Confira: ${selectedService?.nome} em ${selectedDate} às ${selectedSlot}. Sinal: ${formatCurrency(selectedDeposit)}.` })
    if (step === 'done') messages.push({ from: 'bot', text: 'Agendamento realizado com sucesso. Muito obrigado, até mais!' })
  }

  function goToService() {
    if (!form.nome.trim()) {
      setError('Informe seu nome para continuar.')
      return
    }

    setError('')
    setStep('service')
  }

  function chooseService(serviceId) {
    setSelectedServiceId(String(serviceId))
    setError('')
    setStep('date')
  }

  function chooseDate(day) {
    setSelectedDate(day)
    setError('')
    setStep('time')
  }

  function chooseSlot(time) {
    setSelectedSlot(time)
    setError('')
    setStep('phone')
  }

  function goToEmail() {
    if (!form.telefone.trim()) {
      setError('Digite seu telefone para continuar.')
      return
    }

    setError('')
    setStep('email')
  }

  function goToConfirm() {
    setError('')
    setStep('confirm')
  }

  async function handleBookingSubmit() {
    if (!selectedServiceId || !selectedSlot || !form.nome.trim() || !form.telefone.trim()) {
      setError('Complete os dados do agendamento para continuar.')
      return
    }

    try {
      setBookingLoading(true)
      setError('')

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

      const searchParams = new URLSearchParams({ date: selectedDate })
      searchParams.set('servicoId', selectedServiceId)
      setStep('done')

      try {
        const refreshedAgenda = await fetchJson(`${API_BASE_URL}/barbearias/${slug}/agenda?${searchParams.toString()}`)
        setAgenda(refreshedAgenda)
      } catch {
        setAgenda((current) => {
          if (!current?.slots) return current
          return {
            ...current,
            slots: current.slots.map((slot) =>
              slot.time === selectedSlot ? { ...slot, disponivel: false, tag: 'ocupado' } : slot
            ),
          }
        })
      }
    } catch (submitError) {
      setError(submitError.message)
      if (submitError.message.includes('reservado')) {
        setStep('time')
      }
    } finally {
      setBookingLoading(false)
    }
  }

  function resetChat() {
    setSelectedServiceId('')
    setSelectedSlot('')
    setSelectedDate(getNextDays(4)[0])
    setError('')
    setForm({ nome: '', telefone: '', email: '' })
    setStep('name')
  }

  function renderActions() {
    if (!shop) return null

    if (step === 'name') {
      return (
        <form className="space-y-3" onSubmit={(event) => { event.preventDefault(); goToService() }}>
          <Input
            value={form.nome}
            onChange={(event) => setForm((current) => ({ ...current, nome: event.target.value }))}
            placeholder="Seu nome e sobrenome"
            className="h-14 rounded-lg border-border bg-background text-foreground placeholder:text-muted-foreground"
          />
          <Button type="submit" className="h-14 w-full rounded-lg bg-primary text-primary-foreground hover:bg-primary/90">
            Enviar
          </Button>
        </form>
      )
    }

    if (step === 'service') {
      if (!shop.servicos?.length) {
        return (
          <div className="space-y-3">
            <div className="rounded-lg border border-primary/15 bg-secondary p-4 text-sm leading-6 text-secondary-foreground">
              Cadastre pelo menos um serviço ativo no painel para liberar o agendamento por link.
            </div>
            {shop.whatsappLink && (
              <Button asChild variant="outline" className="h-14 w-full rounded-lg border-primary/20 bg-card text-foreground hover:bg-secondary">
                <a href={shop.whatsappLink} target="_blank" rel="noreferrer">
                  Falar com a barbearia
                </a>
              </Button>
            )}
          </div>
        )
      }

      return (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {shop.servicos.map((service) => (
            <button
              key={service.id}
              type="button"
              onClick={() => chooseService(service.id)}
              className="min-w-[180px] rounded-lg border border-primary/15 bg-card p-4 text-left text-foreground shadow-sm transition hover:border-primary/40 hover:bg-secondary"
            >
              <p className="font-semibold">{service.nome}</p>
              <p className="mt-2 text-sm text-muted-foreground">{service.duracaoMin} min</p>
              <p className="mt-3 text-lg font-bold text-primary">{formatCurrency(service.preco)}</p>
            </button>
          ))}
        </div>
      )
    }

    if (step === 'date') {
      return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {days.map((day) => {
            const formatted = formatDateLabel(day)
            return (
              <button
                key={day}
                type="button"
                onClick={() => chooseDate(day)}
                className="rounded-lg border border-primary/15 bg-card px-3 py-4 text-center text-foreground shadow-sm transition hover:border-primary/40 hover:bg-secondary"
              >
                <p className="text-xs uppercase text-muted-foreground">{formatted.short}</p>
                <p className="mt-2 font-bold">{formatted.dayMonth}</p>
              </button>
            )
          })}
        </div>
      )
    }

    if (step === 'time') {
      return (
        <div className="grid grid-cols-3 gap-3">
          {availableSlots.length ? (
            availableSlots.slice(0, 12).map((slot) => (
              <button
                key={slot.time}
                type="button"
                onClick={() => chooseSlot(slot.time)}
                className="rounded-lg border border-primary/15 bg-card px-3 py-4 text-center font-semibold text-foreground shadow-sm transition hover:border-primary/40 hover:bg-secondary"
              >
                {slot.time}
              </button>
            ))
          ) : (
            <div className="col-span-3 rounded-lg border border-border bg-muted p-4 text-center text-sm text-muted-foreground">
              Neste dia, todos os horários já foram reservados.
            </div>
          )}
          <Button type="button" variant="outline" className="col-span-3 h-12 rounded-lg border-primary/20 bg-card text-foreground hover:bg-secondary" onClick={() => setStep('date')}>
            Escolher outro dia
          </Button>
        </div>
      )
    }

    if (step === 'phone') {
      return (
        <form className="space-y-3" onSubmit={(event) => { event.preventDefault(); goToEmail() }}>
          <Input
            value={form.telefone}
            onChange={(event) => setForm((current) => ({ ...current, telefone: event.target.value }))}
            placeholder="Telefone"
            className="h-14 rounded-lg border-border bg-background text-foreground placeholder:text-muted-foreground"
          />
          <Button type="submit" className="h-14 w-full rounded-lg bg-primary text-primary-foreground hover:bg-primary/90">
            Enviar
          </Button>
        </form>
      )
    }

    if (step === 'email') {
      return (
        <form className="space-y-3" onSubmit={(event) => { event.preventDefault(); goToConfirm() }}>
          <Input
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            placeholder="Seu e-mail"
            className="h-14 rounded-lg border-border bg-background text-foreground placeholder:text-muted-foreground"
          />
          <div className="grid grid-cols-2 gap-3">
            <Button type="button" variant="outline" className="h-14 rounded-lg border-primary/20 bg-card text-foreground hover:bg-secondary" onClick={goToConfirm}>
              Pular
            </Button>
            <Button type="submit" className="h-14 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90">
              Enviar
            </Button>
          </div>
        </form>
      )
    }

    if (step === 'confirm') {
      return (
        <div className="space-y-3">
          <Button
            type="button"
            disabled={bookingLoading}
            className="h-14 w-full rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleBookingSubmit}
          >
            {bookingLoading ? 'Confirmando...' : 'Confirmar agendamento'}
          </Button>
          <Button type="button" variant="outline" className="h-12 w-full rounded-lg border-primary/20 bg-card text-foreground hover:bg-secondary" onClick={() => setStep('time')}>
            Escolher outro horário
          </Button>
        </div>
      )
    }

    return (
      <div className="grid gap-3 sm:grid-cols-2">
        <Button type="button" className="h-14 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90" onClick={resetChat}>
          Novo agendamento
        </Button>
        {shop.whatsappLink && (
          <Button asChild variant="outline" className="h-14 rounded-lg border-primary/20 bg-card text-foreground hover:bg-secondary">
            <a href={shop.whatsappLink} target="_blank" rel="noreferrer">
              Falar com a barbearia
            </a>
          </Button>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
        <div className="rounded-lg border border-border bg-card px-6 py-5 text-sm text-muted-foreground shadow-sm">Carregando assistente...</div>
      </div>
    )
  }

  if (error && !shop) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
        <div className="w-full max-w-xl rounded-lg border border-border bg-card p-8 text-center shadow-sm">
          <Badge variant="secondary">Link não encontrado</Badge>
          <h1 className="mt-4 text-3xl font-bold">Essa barbearia não está disponível.</h1>
          <p className="mt-3 text-muted-foreground">{error}</p>
          <Button asChild className="mt-5 bg-primary text-primary-foreground hover:bg-primary/90">
            <Link to="/">Voltar para o início</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-border bg-card/95 px-4 py-4 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border bg-white">
              <img src={logo} alt="CorteCertoApp" className="h-8 w-auto object-contain" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold">{shop.nome}</p>
              <p className="truncate text-xs text-muted-foreground">{shop.cidade || 'Agenda online'}</p>
            </div>
          </div>
          <Button type="button" variant="outline" className="rounded-lg border-primary/20 bg-card text-foreground hover:bg-secondary" onClick={resetChat}>
            Reiniciar
          </Button>
        </div>
      </header>

      <main className="mx-auto flex min-h-[calc(100vh-76px)] max-w-3xl flex-col px-4 py-6">
        <div className="flex-1 space-y-4 pb-8">
          {messages.map((message, index) => (
            <div key={`${message.text}-${index}`} className={`flex items-end gap-3 ${message.from === 'human' ? 'justify-end' : ''}`}>
              {message.from === 'bot' && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                  CC
                </div>
              )}
              <div className={`max-w-[84%] rounded-lg px-5 py-4 text-sm leading-6 shadow-lg ${
                message.from === 'human'
                  ? 'border border-border bg-card text-foreground'
                  : 'bg-primary text-primary-foreground'
              }`}>
                {message.text}
              </div>
            </div>
          ))}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>

        <div className="sticky bottom-0 rounded-lg border border-border bg-card/95 p-4 shadow-2xl backdrop-blur">
          {renderActions()}
        </div>
      </main>
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
