const BarbeariaService = require('./service')

class BarbeariasController {
  async index(req, res) {
    const barbearias = await BarbeariaService.getBarbearias(req.usuario?.id)
    res.json(barbearias)
  }

  async show(req, res) {
    const barbearia = await BarbeariaService.getBarbeariaById(Number(req.params.id), req.usuario?.id)
    res.json(barbearia)
  }

  async create(req, res) {
    const barbearia = await BarbeariaService.createBarbearia(req.body, req.usuario?.id)
    res.status(201).json(barbearia)
  }

  async update(req, res) {
    const barbearia = await BarbeariaService.updateBarbearia(Number(req.params.id), req.body, req.usuario?.id)
    res.json(barbearia)
  }

  async delete(req, res) {
    await BarbeariaService.deleteBarbearia(Number(req.params.id), req.usuario?.id)
    res.status(204).send()
  }
}

module.exports = new BarbeariasController()
