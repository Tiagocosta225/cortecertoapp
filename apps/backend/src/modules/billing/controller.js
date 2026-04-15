const BillingService = require('./service')

class BillingController {
  async plans(req, res) {
    res.json(await BillingService.getPlans())
  }

  async subscription(req, res) {
    res.json(await BillingService.getSubscription(req.usuario.id))
  }

  async checkout(req, res) {
    res.status(201).json(await BillingService.createCheckout(req.usuario.id, req.body))
  }

  async cancel(req, res) {
    res.json(await BillingService.cancel(req.usuario.id))
  }

  async webhook(req, res) {
    const expectedToken = process.env.ASAAS_WEBHOOK_TOKEN
    const receivedToken = req.headers['asaas-access-token'] || req.headers['x-asaas-token'] || req.query.token

    if (expectedToken && receivedToken !== expectedToken) {
      return res.status(401).json({ message: 'Webhook não autorizado' })
    }

    res.json(await BillingService.handleWebhook(req.body))
  }
}

module.exports = new BillingController()
