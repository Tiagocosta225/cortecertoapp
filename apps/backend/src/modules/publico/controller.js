const PublicService = require('./service')

class PublicoController {
  async showBarbearia(req, res) {
    const payload = await PublicService.getBarbeariaPublica(req.params.slug)
    res.json(payload)
  }

  async showAgenda(req, res) {
    const payload = await PublicService.getAgendaPublica(req.params.slug, req.query.date)
    res.json(payload)
  }

  async createAgendamento(req, res) {
    const payload = await PublicService.criarAgendamentoPublico(req.params.slug, req.body)
    res.status(201).json(payload)
  }
}

module.exports = new PublicoController()
