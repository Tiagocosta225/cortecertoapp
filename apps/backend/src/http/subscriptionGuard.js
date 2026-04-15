const BillingService = require('../modules/billing/service')

async function requireActiveSubscription(req, res, next) {
  if (!req.usuario?.id) {
    return res.status(401).json({ message: 'Não autorizado', error: 'Não autorizado' })
  }

  const active = await BillingService.hasActiveSubscriptionForUser(req.usuario.id)
  if (!active) {
    return res.status(402).json({
      message: 'Assinatura inativa. Regularize o plano para continuar usando a plataforma.',
      error: 'Assinatura inativa. Regularize o plano para continuar usando a plataforma.',
    })
  }

  return next()
}

module.exports = requireActiveSubscription
