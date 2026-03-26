const ClienteService = require('./service')

class ClientesController {
  async index(req, res) {
    const clientes = await ClienteService.getClientes()
    res.json(clientes)
  }

  async show(req, res) {
    const cliente = await ClienteService.getClienteById(Number(req.params.id))
    res.json(cliente)
  }

  async create(req, res) {
    const cliente = await ClienteService.createCliente(req.body)
    res.status(201).json(cliente)
  }

  async update(req, res) {
    const cliente = await ClienteService.updateCliente(Number(req.params.id), req.body)
    res.json(cliente)
  }

  async delete(req, res) {
    await ClienteService.deleteCliente(Number(req.params.id))
    res.status(204).send()
  }
}

module.exports = new ClientesController()
