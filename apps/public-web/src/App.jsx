import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Crown,
  MessageCircle,
  PhoneCall,
  PiggyBank,
  QrCode,
  Scissors,
  Sparkles,
  Star,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import './App.css'

const barbershopData = {
  'barbearia-do-joao': {
    name: 'Barbearia do Joao',
    owner: 'Joao',
    city: 'Sao Paulo',
    rating: 4.9,
    reviewCount: 328,
    hero: 'Cortes premium com encaixe inteligente e confirmacao rapida.',
    services: [
      { id: 'combo', name: 'Corte + barba premium', duration: '50 min', price: 'R$ 75', deposit: 'R$ 15' },
      { id: 'corte', name: 'Corte assinatura', duration: '35 min', price: 'R$ 45', deposit: 'R$ 10' },
      { id: 'acabamento', name: 'Acabamento expresso', duration: '20 min', price: 'R$ 30', deposit: 'R$ 5' },
    ],
    quickActions: [
      'Quero o melhor horario de hoje',
      'Prefiro confirmar via WhatsApp',
      'Tenho urgencia e aceito encaixe',
    ],
    days: [
      { label: 'Hoje', date: '18 Mar', occupancy: '3 horarios premium' },
      { label: 'Amanha', date: '19 Mar', occupancy: '5 horarios livres' },
      { label: 'Qui', date: '20 Mar', occupancy: 'Baixa demanda' },
      { label: 'Sex', date: '21 Mar', occupancy: 'Alta procura' },
    ],
    times: [
      { time: '09:30', tag: 'Mais rentavel', tone: 'success' },
      { time: '11:10', tag: 'Encaixe inteligente', tone: 'neutral' },
      { time: '14:40', tag: 'Pix antecipado', tone: 'warning' },
      { time: '17:20', tag: 'Ultimo slot premium', tone: 'accent' },
    ],
    funnel: {
      reserveRate: '84%',
      noShowDrop: '-61%',
      weeklyRevenue: 'R$ 6.840',
    },
  },
}

const toneClassnames = {
  success: 'booking-tone-success',
  neutral: 'booking-tone-neutral',
  warning: 'booking-tone-warning',
  accent: 'booking-tone-accent',
}

function MarketingHome() {
  return (
    <div className="marketing-shell">
      <section className="marketing-hero">
        <div className="marketing-copy">
          <Badge className="marketing-badge">Sistema para aumentar o faturamento da barbearia</Badge>
          <h1>CorteCertoApp transforma agendamento em motor de receita.</h1>
          <p>
            Link compartilhavel, reserva com Pix, CRM de reativacao e agenda que empurra os horarios mais
            rentaveis. O barbeiro para de gerenciar agenda e passa a operar faturamento.
          </p>
          <div className="marketing-actions">
            <Button asChild size="lg" className="marketing-primary-button">
              <Link to="/barbearia-do-joao">
                Ver link de agendamento <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="marketing-secondary-button">
              <a href="#mvp-escala">Estrutura MVP → Escala</a>
            </Button>
          </div>
          <div className="marketing-proof">
            <div>
              <strong>Anti-furo</strong>
              <span>Reserva com taxa ou Pix antecipado.</span>
            </div>
            <div>
              <strong>CRM simples</strong>
              <span>WhatsApp automatico para cliente sumido.</span>
            </div>
            <div>
              <strong>Agenda inteligente</strong>
              <span>Slots vazios viram oportunidades de receita.</span>
            </div>
          </div>
        </div>

        <Card className="marketing-preview">
          <CardContent className="marketing-preview-content">
            <div className="preview-header">
              <div>
                <p>Link publico</p>
                <strong>cortecerto.app/barbearia-do-joao</strong>
              </div>
              <Badge variant="secondary">Sem login</Badge>
            </div>
            <div className="preview-chat">
              <div className="chat-bubble chat-bubble-brand">
                Fala, Joao. Quer preencher horario vazio ou empurrar ticket medio maior?
              </div>
              <div className="chat-bubble">
                Quero encaixar clientes premium hoje e confirmar no WhatsApp.
              </div>
            </div>
            <div className="preview-grid">
              <article>
                <PiggyBank className="h-5 w-5" />
                <strong>R$ 1.240</strong>
                <span>recuperados com anti-no-show</span>
              </article>
              <article>
                <TrendingUp className="h-5 w-5" />
                <strong>+22%</strong>
                <span>ticket com combos e encaixes</span>
              </article>
              <article>
                <MessageCircle className="h-5 w-5" />
                <strong>37 clientes</strong>
                <span>reativados via WhatsApp</span>
              </article>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="marketing-section">
        <div className="section-heading">
          <Badge variant="outline">Diferencial real</Badge>
          <h2>O produto vende faturamento, nao agenda.</h2>
        </div>
        <div className="feature-grid">
          <Card>
            <CardContent className="feature-card">
              <Wallet className="h-6 w-6" />
              <h3>Anti-furo com Pix</h3>
              <p>Reserva antecipada para reduzir faltas e proteger os horarios mais disputados.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="feature-card">
              <MessageCircle className="h-6 w-6" />
              <h3>Cliente sumiu? O sistema reage</h3>
              <p>Disparo automatico para trazer de volta quem passou do tempo ideal de retorno.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="feature-card">
              <CalendarDays className="h-6 w-6" />
              <h3>Agenda inteligente</h3>
              <p>Sugestoes de encaixe, horarios ociosos e slots com melhor potencial de receita.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="feature-card">
              <Crown className="h-6 w-6" />
              <h3>Ranking de clientes</h3>
              <p>Quem mais volta, quem mais gasta e onde vale acionar campanha ou upgrade.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="mvp-escala" className="marketing-section">
        <div className="section-heading">
          <Badge variant="outline">Estrutura do produto</Badge>
          <h2>MVP agora, escala depois.</h2>
        </div>
        <div className="stage-grid">
          <Card>
            <CardContent className="stage-card">
              <span className="stage-label">MVP</span>
              <h3>Capturar, confirmar e faturar</h3>
              <ul>
                <li>Link de agendamento por slug</li>
                <li>Calendario visual com botao de WhatsApp</li>
                <li>Taxa de reserva em Pix</li>
                <li>Painel com agenda do dia e faturamento semanal</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="stage-card">
              <span className="stage-label">Escala</span>
              <h3>CRM, automacoes e mais receita</h3>
              <ul>
                <li>Fluxos automativos de retorno</li>
                <li>Ranking de clientes e LTV</li>
                <li>Regras por barbeiro e servico</li>
                <li>Operacao dockerizada pronta para on-premise</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

function BookingLinkPage() {
  const { slug = '' } = useParams()
  const shop = barbershopData[slug]

  if (!shop) {
    return (
      <div className="booking-shell booking-not-found">
        <Badge variant="secondary">Link nao encontrado</Badge>
        <h1>Esse link de agendamento nao esta ativo.</h1>
        <p>Use um slug valido da barbearia ou volte para a apresentacao do produto.</p>
        <Button asChild>
          <Link to="/">Voltar para o CorteCertoApp</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="booking-shell">
      <section className="booking-hero-card">
        <div>
          <Badge className="booking-badge">
            <Sparkles className="h-3.5 w-3.5" />
            Link inteligente de agendamento
          </Badge>
          <h1>{shop.name}</h1>
          <p>{shop.hero}</p>
          <div className="booking-meta">
            <span>
              <Star className="h-4 w-4" />
              {shop.rating} ({shop.reviewCount} avaliacoes)
            </span>
            <span>
              <Scissors className="h-4 w-4" />
              {shop.city}
            </span>
            <span>
              <Clock3 className="h-4 w-4" />
              Confirmacao em menos de 2 min
            </span>
          </div>
        </div>

        <Card className="booking-kpi-card">
          <CardContent className="booking-kpi-content">
            <h2>O que esse link ja entrega</h2>
            <div className="booking-kpi-grid">
              <article>
                <strong>{shop.funnel.reserveRate}</strong>
                <span>reservas confirmadas</span>
              </article>
              <article>
                <strong>{shop.funnel.noShowDrop}</strong>
                <span>queda no no-show</span>
              </article>
              <article>
                <strong>{shop.funnel.weeklyRevenue}</strong>
                <span>faturamento semanal</span>
              </article>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="booking-content-grid">
        <Card className="booking-chat-card">
          <CardContent className="booking-card-content">
            <div className="section-heading compact">
              <Badge variant="outline">Atendimento hibrido</Badge>
              <h2>Chat leve com botoes rapidos</h2>
            </div>
            <div className="booking-chat">
              <div className="chat-bubble chat-bubble-brand">
                {shop.owner}, se quiser eu priorizo o melhor horario para hoje ou ja deixo a reserva com Pix.
              </div>
              {shop.quickActions.map((action) => (
                <button key={action} className="quick-action">
                  {action}
                </button>
              ))}
              <div className="chat-bubble">
                Recomendacao do sistema: ofertar o combo premium em horario de encaixe para elevar ticket medio.
              </div>
            </div>
            <div className="booking-contact-actions">
              <Button className="booking-primary-button">
                <MessageCircle className="h-4 w-4" />
                Confirmar pelo WhatsApp
              </Button>
              <Button variant="outline" className="booking-outline-button">
                <PhoneCall className="h-4 w-4" />
                Falar com barbeiro
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="booking-calendar-card">
          <CardContent className="booking-card-content">
            <div className="section-heading compact">
              <Badge variant="outline">Calendario visual</Badge>
              <h2>Escolha servico, dia e slot mais vantajoso</h2>
            </div>

            <div className="service-list">
              {shop.services.map((service) => (
                <button key={service.id} className="service-item">
                  <div>
                    <strong>{service.name}</strong>
                    <span>{service.duration}</span>
                  </div>
                  <div className="service-price">
                    <span>{service.price}</span>
                    <small>reserva {service.deposit}</small>
                  </div>
                </button>
              ))}
            </div>

            <div className="day-list">
              {shop.days.map((day) => (
                <button key={day.date} className="day-item">
                  <strong>{day.label}</strong>
                  <span>{day.date}</span>
                  <small>{day.occupancy}</small>
                </button>
              ))}
            </div>

            <div className="time-grid">
              {shop.times.map((slot) => (
                <button key={slot.time} className={`time-slot ${toneClassnames[slot.tone]}`}>
                  <strong>{slot.time}</strong>
                  <span>{slot.tag}</span>
                </button>
              ))}
            </div>

            <div className="deposit-box">
              <div>
                <Badge className="deposit-badge">
                  <QrCode className="h-3.5 w-3.5" />
                  Anti-furo ativo
                </Badge>
                <h3>Reserva garantida com Pix de R$ 15</h3>
                <p>O valor protege o horario premium e reduz falta. Se precisar remarcar, o credito continua valendo.</p>
              </div>
              <Button className="booking-primary-button">Reservar agora</Button>
            </div>
          </CardContent>
        </Card>
      </section>
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
