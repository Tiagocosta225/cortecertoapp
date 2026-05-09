import { useState } from 'react'
import logo from './assets/logo-cortecertoapp.png'
import './App.css'

const getAdminUrl = () => {
  const envUrl = import.meta.env.VITE_ADMIN_URL

  if (envUrl) {
    return envUrl
  }

  if (typeof window === 'undefined') {
    return '#'
  }

  const currentUrl = new URL(window.location.href)

  if (currentUrl.hostname === 'localhost' || currentUrl.hostname === '127.0.0.1') {
    currentUrl.port = '3000'
    return currentUrl.toString()
  }

  if (currentUrl.hostname.startsWith('landing.')) {
    currentUrl.hostname = currentUrl.hostname.replace(/^landing\./, 'admin.')
    return currentUrl.toString()
  }

  if (currentUrl.hostname === 'www.cortecertoapp.com.br' || currentUrl.hostname === 'cortecertoapp.com.br') {
    currentUrl.hostname = 'admin.cortecertoapp.com.br'
    return currentUrl.toString()
  }

  currentUrl.hostname = `admin.${currentUrl.hostname}`
  return currentUrl.toString()
}

const metrics = [
  { value: '1 link', label: 'para cada barbearia lotar a agenda com mais ordem' },
  { value: '24h', label: 'de reserva aberta enquanto você está atendendo' },
  { value: 'Pix + WhatsApp', label: 'para confirmar rápido e girar melhor a cadeira' },
]

const salesTriggers = [
  {
    eyebrow: 'Mais previsibilidade',
    title: 'Menos conversa espalhada e mais horário fechado com rapidez.',
    description:
      'O cliente já entra vendo serviço, duração, sinal e horários livres. Isso reduz pergunta repetida e acelera o fechamento do agendamento.',
  },
  {
    eyebrow: 'Mais valor percebido',
    title: 'Sua barbearia passa mais confiança sem perder a pegada popular.',
    description:
      'A página pública funciona como uma vitrine forte para Instagram, Google e WhatsApp, ajudando a vender melhor o horário e a manter o movimento.',
  },
  {
    eyebrow: 'Menos faltas',
    title: 'Reserva antecipada para proteger os horários de pico.',
    description:
      'Quando fizer sentido, a cobrança de sinal por Pix filtra curiosos, melhora compromisso e protege os horários mais valiosos do dia.',
  },
]

const steps = [
  'Você divulga um único link da barbearia nas redes, na bio, no balcão e no WhatsApp.',
  'O cliente escolhe serviço, dia e horário sem ficar perguntando tudo no chat.',
  'O agendamento entra mais redondo e ainda pode seguir para confirmação direta no WhatsApp.',
]

const features = [
  'Página pública com logo, serviços, preço e horários da barbearia',
  'Agendamento por link único sem cadastro complicado para o cliente',
  'Sinal de reserva para horários de pico ou serviços mais disputados',
  'Fluxo pensado para mobile, Instagram, QR Code e compartilhamento rápido',
  'Mais clareza para vender corte, barba e combos antes da conversa',
  'Contato direto com a barbearia quando precisar confirmar ou ajustar',
]

const objections = [
  {
    title: '“Meu cliente prefere WhatsApp”',
    description:
      'Ótimo. O link público não substitui o WhatsApp, ele só faz o cliente chegar no chat mais decidido e com menos dúvida básica.',
  },
  {
    title: '“Tenho medo de sistema complicado”',
    description:
      'A proposta é justamente o contrário: menos enrolação, menos tela demais e um fluxo direto para a rotina corrida da barbearia.',
  },
  {
    title: '“Quero lotar a agenda sem perder agilidade”',
    description:
      'O design da página pública ajuda a passar confiança, vender melhor o horário e manter o alto giro com mais organização.',
  },
]

const pricing = [
  {
    badge: 'Mais escolhido',
    name: 'Plano mensal',
    price: '29,90',
    description: 'Para manter a agenda da barbearia organizada o mês inteiro.',
    items: [
      'Link público da barbearia',
      'Serviços com preço, duração e sinal',
      'Agenda online para encaixar mais cliente',
      'Contato rápido com o cliente',
    ],
    featured: false,
  },
  {
    badge: 'Oferta de entrada',
    name: 'Primeiro mês',
    price: '9,90',
    description: 'Baixa barreira para testar e sentir a agenda girando melhor na prática.',
    items: [
      'Tudo do plano mensal',
      'Primeiro mês com preço promocional',
      'Sem implantação demorada',
      'Cancele quando quiser',
    ],
    featured: true,
  },
  {
    badge: 'Teste inicial',
    name: '7 dias grátis',
    price: '0',
    description: 'Comece com risco zero e valide o link único no dia a dia da barbearia.',
    items: [
      'Acesso completo',
      'Sem cartão de crédito',
      'Perfeito para validar com sua equipe e seus clientes',
      'Migração simples para o plano pago',
    ],
    featured: false,
  },
]

function App() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const adminUrl = getAdminUrl()

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!email) return
    setSubmitted(true)
    setEmail('')
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="app">
      <header className="header">
        <div className="container header-inner">
          <div className="logo-container">
            <img src={logo} alt="CorteCertoApp" className="logo-img" />
          </div>
          <div className="header-actions">
            <nav className="nav">
              <a href="#beneficios">Benefícios</a>
              <a href="#como-funciona">Como funciona</a>
              <a href="#oferta">Oferta</a>
              <a href="#contato">Contato</a>
            </nav>
            <a href={adminUrl} className="btn btn-admin">
              Acessar painel admin
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              <div className="hero-pill">Agendamento por link único para barbearias</div>
              <h1 className="hero-title">
                Transforme seu link em uma vitrine que enche a agenda, acelera o atendimento e reduz conversa repetida.
              </h1>
              <p className="hero-subtitle">
                O CorteCertoApp cria uma página pública para sua barbearia com serviços, horários, sinal por Pix e
                confirmação rápida. É a solução para barbearia de alto giro que quer mais cliente marcado e menos tempo perdido no WhatsApp.
              </p>

              <div className="cta-buttons">
                <a href="#contato" className="btn btn-primary">
                  Quero ativar meu link
                </a>
                <a href="#como-funciona" className="btn btn-secondary">
                  Ver como funciona
                </a>
              </div>

              <div className="metrics-grid">
                {metrics.map((metric) => (
                  <div key={metric.label} className="metric-card">
                    <strong>{metric.value}</strong>
                    <span>{metric.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="hero-panel">
              <div className="hero-panel-top">
                <span className="hero-status">Experiência do cliente</span>
                <span className="hero-live">Ao vivo</span>
              </div>

              <div className="hero-panel-card">
                <p className="panel-label">Link da barbearia</p>
                <p className="panel-value">cortecerto.app/barbearia-do-joao</p>
              </div>

              <div className="hero-panel-card">
                <p className="panel-label">Serviço premium</p>
                <p className="panel-value">Corte + barba</p>
                <div className="panel-tags">
                  <span>45 min</span>
                  <span>R$ 10 de sinal</span>
                </div>
              </div>

              <div className="hero-panel-card">
                <p className="panel-label">Por que converte melhor</p>
                <ul className="panel-list">
                  <li>O cliente entende preço e horário antes de chamar</li>
                  <li>O agendamento fecha mais rápido nos horários vagos</li>
                  <li>A confirmação fica mais prática para quem atende muito</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="dark-section">
          <div className="container">
            <div className="section-heading section-heading-light">
              <p className="eyebrow">Gatilhos de venda</p>
              <h2>Quando a agenda parece organizada, o cliente decide mais rápido e ocupa o horário com menos resistência.</h2>
            </div>

            <div className="trigger-grid">
              {salesTriggers.map((item) => (
                <article key={item.title} className="trigger-card">
                  <p className="trigger-eyebrow">{item.eyebrow}</p>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="beneficios" className="section light-section">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">Benefícios reais</p>
              <h2>O link único não é só um atalho. Ele vira um canal para lotar a agenda com mais controle.</h2>
              <p>
                A proposta é deixar seu cliente com menos dúvida e sua operação com menos improviso. Isso reduz atrito,
                ajuda a preencher horários mais rápido e melhora o ritmo da barbearia durante o dia.
              </p>
            </div>

            <div className="feature-grid">
              {features.map((item) => (
                <div key={item} className="feature-card">
                  <div className="feature-check">✓</div>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="como-funciona" className="section timeline-section">
          <div className="container timeline-grid">
            <div className="timeline-copy">
              <p className="eyebrow">Como funciona</p>
              <h2>Uma jornada curta para o cliente. Um ganho grande para a barbearia de movimento forte.</h2>
              <p>
                O processo foi pensado para a realidade de quem precisa vender horário sem perder tempo em conversa
                repetitiva. Você divulga uma vez, e o cliente chega mais pronto para marcar.
              </p>
            </div>

            <div className="timeline-list">
              {steps.map((step, index) => (
                <div key={step} className="timeline-item">
                  <div className="timeline-number">0{index + 1}</div>
                  <p>{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section comparison-section">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">Antes e depois</p>
              <h2>Troque a correria no improviso por uma página que ajuda o cliente a decidir rápido.</h2>
            </div>

            <div className="comparison-grid">
              <div className="comparison-card comparison-card-muted">
                <h3>Sem link único</h3>
                <ul>
                  <li>Cliente pergunta preço, duração e horário em mensagens separadas</li>
                  <li>Horário bom fica parado em conversa sem compromisso</li>
                  <li>A equipe perde tempo respondendo o mesmo tipo de dúvida o dia todo</li>
                </ul>
              </div>

              <div className="comparison-card comparison-card-highlight">
                <h3>Com CorteCertoApp</h3>
                <ul>
                  <li>O cliente já entra vendo serviço, horário e regras da reserva</li>
                  <li>Seu link parece vitrine pronta para girar atendimento</li>
                  <li>Você recebe pedidos mais claros, mais rápidos e com mais intenção de compra</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="section objections-section">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">Objeções comuns</p>
              <h2>O CorteCerto foi pensado para a rotina corrida da barbearia popular, não para um cenário idealizado.</h2>
            </div>

            <div className="objection-grid">
              {objections.map((item) => (
                <article key={item.title} className="objection-card">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="oferta" className="section pricing-section">
          <div className="container">
            <div className="section-heading">
              <p className="eyebrow">Oferta</p>
              <h2>Escolha uma entrada simples e comece a girar sua agenda com mais organização.</h2>
              <p>Sem implantação pesada. Sem curva longa. Só um fluxo claro para divulgar, marcar e confirmar.</p>
            </div>

            <div className="pricing-grid">
              {pricing.map((plan) => (
                <article key={plan.name} className={`pricing-card ${plan.featured ? 'featured' : ''}`}>
                  <span className={`pricing-badge ${plan.featured ? 'featured-badge' : ''}`}>{plan.badge}</span>
                  <h3>{plan.name}</h3>
                  <div className="price">
                    <span className="currency">R$</span>
                    <span className="amount">{plan.price}</span>
                    <span className="period">/mês</span>
                  </div>
                  <p className="price-description">{plan.description}</p>
                  <ul className="features-list">
                    {plan.items.map((item) => (
                      <li key={item}>✓ {item}</li>
                    ))}
                  </ul>
                  <a href="#contato" className={plan.featured ? 'btn btn-primary-featured' : 'btn btn-primary'}>
                    Quero começar
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contato" className="section cta-section">
          <div className="container cta-shell">
            <div className="cta-copy">
              <p className="eyebrow">Chamada final</p>
              <h2>Se sua agenda ainda depende de conversa demais, está na hora de vender o horário com mais velocidade.</h2>
              <p>
                Ative sua página pública, divulgue um único link e deixe o cliente chegar mais pronto para marcar,
                ocupar horário e manter sua operação girando melhor.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="email-form">
              <input
                type="email"
                placeholder="Seu melhor email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary">
                Quero testar agora
              </button>
              {submitted && <p className="success-message">✓ Recebemos seu interesse. Próximo passo: ativar seu link.</p>}
            </form>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-content">
          <div>
            <img src={logo} alt="CorteCertoApp" className="footer-logo" />
            <p>A agenda pública com link único para barbearias de alto giro venderem melhor e atenderem com mais ordem.</p>
          </div>
          <div className="footer-links">
            <a href="#beneficios">Benefícios</a>
            <a href="#como-funciona">Como funciona</a>
            <a href="#oferta">Oferta</a>
            <a href="#contato">Contato</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
