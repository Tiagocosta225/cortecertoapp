const DashboardService = require('./service')

class DashboardController {
  async overview(req, res) {
    const data = await DashboardService.getOverview(Number(req.params.id))
    res.json(data)
  }

  async agendaInteligente(req, res) {
    const data = await DashboardService.getAgendaInteligente(
      Number(req.params.id),
      req.query.date,
      req.query.days || 2
    )
    res.json(data)
  }

  async clientesInsights(req, res) {
    const data = await DashboardService.getClientesInsights(Number(req.params.id))
    res.json(data)
  }

  async servicosInsights(req, res) {
    const data = await DashboardService.getServicosInsights(Number(req.params.id))
    res.json(data)
  }
}

module.exports = new DashboardController()
