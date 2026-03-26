const ServicoService = require('./service')

class ServicosController {
  async index(req, res) {
    const servicos = await ServicoService.getServicos()
    res.json(servicos)
  }

  async show(req, res) {
    const servico = await ServicoService.getServicoById(Number(req.params.id))
    res.json(servico)
  }

  async create(req, res) {
    const servico = await ServicoService.createServico(req.body)
    res.status(201).json(servico)
  }

  async update(req, res) {
    const servico = await ServicoService.updateServico(Number(req.params.id), req.body)
    res.json(servico)
  }

  async delete(req, res) {
    await ServicoService.deleteServico(Number(req.params.id))
    res.status(204).send()
  }
}

module.exports = new ServicosController()
