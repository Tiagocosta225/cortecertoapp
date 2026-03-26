const BarbeariaService = require('./service')

class BarbeariasController {
  async index(req, res) {
    const barbearias = await BarbeariaService.getBarbearias()
    res.json(barbearias)
  }

  async show(req, res) {
    const barbearia = await BarbeariaService.getBarbeariaById(Number(req.params.id))
    res.json(barbearia)
  }

  async create(req, res) {
    const barbearia = await BarbeariaService.createBarbearia(req.body)
    res.status(201).json(barbearia)
  }

  async update(req, res) {
    const barbearia = await BarbeariaService.updateBarbearia(Number(req.params.id), req.body)
    res.json(barbearia)
  }

  async delete(req, res) {
    await BarbeariaService.deleteBarbearia(Number(req.params.id))
    res.status(204).send()
  }
}

module.exports = new BarbeariasController()
