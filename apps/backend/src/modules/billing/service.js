const prisma = require('../../lib/prisma')
const asaasClient = require('./asaasClient')

const DEFAULT_PLAN_CODE = 'profissional-mensal'
const TRIAL_DAYS = Number(process.env.BILLING_TRIAL_DAYS || 7)
const ACTIVE_STATUSES = ['trialing', 'active']
const PAID_EVENTS = ['PAYMENT_RECEIVED', 'PAYMENT_CONFIRMED', 'PAYMENT_RECEIVED_IN_CASH', 'CHECKOUT_PAID']
const FAILED_EVENTS = ['PAYMENT_OVERDUE', 'PAYMENT_DELETED', 'PAYMENT_REFUNDED', 'PAYMENT_CHARGEBACK_REQUESTED']

function addDays(date, days) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function parseDate(value) {
  if (!value) return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function isSubscriptionUsable(assinatura) {
  if (!assinatura || !ACTIVE_STATUSES.includes(assinatura.status)) return false
  const end = assinatura.currentPeriodEnd || assinatura.trialEndsAt
  return !end || end >= new Date()
}

function publicBaseUrl() {
  return (process.env.PUBLIC_APP_URL || process.env.FRONTEND_URL || 'http://localhost:3002').replace(/\/$/, '')
}

function serializePlano(plano) {
  return {
    id: plano.id,
    codigo: plano.codigo,
    nome: plano.nome,
    descricao: plano.descricao,
    preco: plano.preco,
    periodo: plano.periodo,
    ativo: plano.ativo,
  }
}

function serializeUsuario(usuario) {
  if (!usuario) return null
  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    telefone: usuario.telefone,
  }
}

function serializeBarbearia(barbearia) {
  if (!barbearia) return null
  return {
    id: barbearia.id,
    nome: barbearia.nome,
    slug: barbearia.slug,
  }
}

function serializeAssinatura(assinatura) {
  if (!assinatura) return null
  return {
    id: assinatura.id,
    status: assinatura.status,
    gateway: assinatura.gateway,
    checkoutUrl: assinatura.checkoutUrl,
    currentPeriodStart: assinatura.currentPeriodStart,
    currentPeriodEnd: assinatura.currentPeriodEnd,
    trialEndsAt: assinatura.trialEndsAt,
    cancelAtPeriodEnd: assinatura.cancelAtPeriodEnd,
    ativa: isSubscriptionUsable(assinatura),
    plano: assinatura.plano ? serializePlano(assinatura.plano) : null,
    usuario: assinatura.usuario ? serializeUsuario(assinatura.usuario) : null,
  }
}

async function ensureDefaultPlan() {
  return prisma.plano.upsert({
    where: { codigo: DEFAULT_PLAN_CODE },
    update: {
      nome: 'Profissional Mensal',
      descricao: 'Plano mensal do CorteCertoApp para um perfil dono de barbearia.',
      preco: 39.9,
      periodo: 'mensal',
      ativo: true,
    },
    create: {
      codigo: DEFAULT_PLAN_CODE,
      nome: 'Profissional Mensal',
      descricao: 'Plano mensal do CorteCertoApp para um perfil dono de barbearia.',
      preco: 39.9,
      periodo: 'mensal',
      ativo: true,
    },
  })
}

async function getUser(usuarioId) {
  return prisma.usuario.findUnique({
    where: { id: Number(usuarioId) },
  })
}

async function getUserBarbearia(usuarioId) {
  return prisma.barbearia.findFirst({
    where: { usuarioId: Number(usuarioId) },
    orderBy: { createdAt: 'asc' },
  })
}

async function findCurrentSubscriptionByUser(usuarioId) {
  return prisma.assinatura.findFirst({
    where: { usuarioId: Number(usuarioId) },
    include: { plano: true, usuario: true },
    orderBy: { createdAt: 'desc' },
  })
}

async function createTrialForUser(usuarioId) {
  const usuario = await getUser(usuarioId)
  if (!usuario) throw new Error('Usuário não encontrado')

  const plano = await ensureDefaultPlan()
  const existing = await findCurrentSubscriptionByUser(usuario.id)
  if (existing) return existing

  const now = new Date()
  const trialEndsAt = addDays(now, TRIAL_DAYS)

  return prisma.assinatura.create({
    data: {
      usuarioId: usuario.id,
      planoId: plano.id,
      status: 'trialing',
      gateway: 'asaas',
      currentPeriodStart: now,
      currentPeriodEnd: trialEndsAt,
      trialEndsAt,
    },
    include: { plano: true, usuario: true },
  })
}

async function ensureAsaasCustomer(usuario, assinatura) {
  if (assinatura.gatewayCustomerId) return assinatura.gatewayCustomerId

  const customer = await asaasClient.request('/customers', {
    method: 'POST',
    body: JSON.stringify({
      name: usuario.nome,
      email: usuario.email,
      phone: usuario.telefone,
      externalReference: `usuario:${usuario.id}`,
    }),
  })

  await prisma.assinatura.update({
    where: { id: assinatura.id },
    data: { gatewayCustomerId: customer.id },
  })

  return customer.id
}

async function createAsaasCheckout({ assinatura, plano, usuario }) {
  const successUrl = `${publicBaseUrl()}/assinatura?status=success`
  const cancelUrl = `${publicBaseUrl()}/assinatura?status=cancel`
  const expiredUrl = `${publicBaseUrl()}/assinatura?status=expired`

  const customerId = await ensureAsaasCustomer(usuario, assinatura)
  const checkout = await asaasClient.request('/checkouts', {
    method: 'POST',
    body: JSON.stringify({
      billingTypes: ['CREDIT_CARD'],
      chargeTypes: ['RECURRENT'],
      minutesToExpire: 60,
      customer: customerId,
      callback: {
        successUrl,
        cancelUrl,
        expiredUrl,
      },
      items: [
        {
          name: plano.nome,
          description: plano.descricao || 'Assinatura mensal do CorteCertoApp',
          quantity: 1,
          value: plano.preco,
        },
      ],
      subscription: {
        cycle: 'MONTHLY',
        nextDueDate: new Date().toISOString().slice(0, 10),
      },
      externalReference: `assinatura:${assinatura.id}`,
    }),
  })

  return {
    checkoutId: checkout.id,
    subscriptionId: checkout.subscription || checkout.subscriptionId || null,
    checkoutUrl: checkout.url || checkout.link || checkout.checkoutUrl,
  }
}

class BillingService {
  async getPlans() {
    await ensureDefaultPlan()
    const planos = await prisma.plano.findMany({
      where: { ativo: true },
      orderBy: { preco: 'asc' },
    })
    return planos.map(serializePlano)
  }

  async getSubscription(usuarioId) {
    const [usuario, barbearia] = await Promise.all([getUser(usuarioId), getUserBarbearia(usuarioId)])
    if (!usuario) throw new Error('Usuário não encontrado')

    const assinatura = await createTrialForUser(usuario.id)
    return {
      usuario: serializeUsuario(usuario),
      barbearia: serializeBarbearia(barbearia),
      assinatura: serializeAssinatura(assinatura),
      planos: await this.getPlans(),
    }
  }

  async createCheckout(usuarioId, data = {}) {
    const usuario = await getUser(usuarioId)
    if (!usuario) throw new Error('Usuário não encontrado')

    const plano = data.planoId
      ? await prisma.plano.findFirst({ where: { id: Number(data.planoId), ativo: true } })
      : await ensureDefaultPlan()
    if (!plano) throw new Error('Plano não encontrado')

    const assinatura = await createTrialForUser(usuario.id)
    const checkout = await createAsaasCheckout({ assinatura, plano, usuario })

    const updated = await prisma.assinatura.update({
      where: { id: assinatura.id },
      data: {
        planoId: plano.id,
        status: assinatura.status === 'active' ? 'active' : 'pending',
        gatewayCheckoutId: checkout.checkoutId,
        gatewaySubscriptionId: checkout.subscriptionId || assinatura.gatewaySubscriptionId,
        checkoutUrl: checkout.checkoutUrl,
      },
      include: { plano: true, usuario: true },
    })

    return {
      checkoutUrl: checkout.checkoutUrl,
      checkoutId: checkout.checkoutId,
      assinatura: serializeAssinatura(updated),
    }
  }

  async cancel(usuarioId) {
    const assinatura = await findCurrentSubscriptionByUser(usuarioId)
    if (!assinatura) throw new Error('Assinatura não encontrada')

    if (assinatura.gatewaySubscriptionId && process.env.ASAAS_API_KEY) {
      await asaasClient.request(`/subscriptions/${assinatura.gatewaySubscriptionId}`, {
        method: 'DELETE',
      }).catch(() => null)
    }

    const updated = await prisma.assinatura.update({
      where: { id: assinatura.id },
      data: { status: 'canceled', cancelAtPeriodEnd: true },
      include: { plano: true, usuario: true },
    })

    return serializeAssinatura(updated)
  }

  async hasActiveSubscriptionForUser(usuarioId) {
    const assinatura = await findCurrentSubscriptionByUser(usuarioId)
    return isSubscriptionUsable(assinatura)
  }

  async hasActiveSubscriptionForBarbearia(barbeariaId) {
    const barbearia = await prisma.barbearia.findUnique({
      where: { id: Number(barbeariaId) },
      select: { usuarioId: true },
    })

    if (!barbearia?.usuarioId) return false
    return this.hasActiveSubscriptionForUser(barbearia.usuarioId)
  }

  async handleWebhook(event) {
    const eventName = event?.event
    const payment = event?.payment || null
    const checkout = event?.checkout || event?.checkoutSession || null
    const gatewayPaymentId = payment?.id || null
    const gatewaySubscriptionId = payment?.subscription || checkout?.subscription || null
    const gatewayCheckoutId = checkout?.id || payment?.checkout || payment?.checkoutSession || null

    let assinatura = null
    if (gatewaySubscriptionId) {
      assinatura = await prisma.assinatura.findFirst({
        where: { gatewaySubscriptionId },
        include: { plano: true, usuario: true },
      })
    }
    if (!assinatura && gatewayCheckoutId) {
      assinatura = await prisma.assinatura.findFirst({
        where: { gatewayCheckoutId },
        include: { plano: true, usuario: true },
      })
    }
    const externalReference = payment?.externalReference || checkout?.externalReference
    if (!assinatura && externalReference?.startsWith('assinatura:')) {
      assinatura = await prisma.assinatura.findUnique({
        where: { id: Number(externalReference.replace('assinatura:', '')) },
        include: { plano: true, usuario: true },
      })
    }

    if (!assinatura) {
      return { received: true, ignored: true }
    }

    if (gatewayPaymentId) {
      await prisma.pagamento.upsert({
        where: { gatewayPaymentId },
        update: {
          status: PAID_EVENTS.includes(eventName) ? 'paid' : FAILED_EVENTS.includes(eventName) ? 'failed' : 'pending',
          paidAt: PAID_EVENTS.includes(eventName) ? parseDate(payment?.paymentDate || payment?.confirmedDate) || new Date() : null,
          dueDate: parseDate(payment?.dueDate),
          rawEventId: event?.id || null,
        },
        create: {
          assinaturaId: assinatura.id,
          status: PAID_EVENTS.includes(eventName) ? 'paid' : FAILED_EVENTS.includes(eventName) ? 'failed' : 'pending',
          valor: Number(payment?.value || assinatura.plano?.preco || 0),
          gatewayPaymentId,
          paidAt: PAID_EVENTS.includes(eventName) ? parseDate(payment?.paymentDate || payment?.confirmedDate) || new Date() : null,
          dueDate: parseDate(payment?.dueDate),
          rawEventId: event?.id || null,
        },
      })
    }

    if (PAID_EVENTS.includes(eventName)) {
      const now = new Date()
      await prisma.assinatura.update({
        where: { id: assinatura.id },
        data: {
          status: 'active',
          gatewaySubscriptionId: gatewaySubscriptionId || assinatura.gatewaySubscriptionId,
          gatewayCheckoutId: gatewayCheckoutId || assinatura.gatewayCheckoutId,
          currentPeriodStart: now,
          currentPeriodEnd: addDays(now, 30),
          cancelAtPeriodEnd: false,
        },
      })
    }

    if (FAILED_EVENTS.includes(eventName)) {
      await prisma.assinatura.update({
        where: { id: assinatura.id },
        data: { status: eventName === 'PAYMENT_OVERDUE' ? 'past_due' : 'canceled' },
      })
    }

    return { received: true }
  }
}

module.exports = new BillingService()
module.exports.createTrialForUser = createTrialForUser
module.exports.isSubscriptionUsable = isSubscriptionUsable
