const AgendamentoService = require('./service')

class AgendamentosController {
  async index(req, res) {
    const agendamentos = await AgendamentoService.getAgendamentos()
    res.json(agendamentos)
  }

  async show(req, res) {
    const agendamento = await AgendamentoService.getAgendamentoById(Number(req.params.id))
    res.json(agendamento)
  }

  async create(req, res) {
    const agendamento = await AgendamentoService.createAgendamento(req.body)
    res.status(201).json(agendamento)
  }

  async update(req, res) {
    const agendamento = await AgendamentoService.updateAgendamento(Number(req.params.id), req.body)
    res.json(agendamento)
  }

  async delete(req, res) {
    await AgendamentoService.deleteAgendamento(Number(req.params.id))
    res.status(204).send()
  }
}

module.exports = new AgendamentosController()
