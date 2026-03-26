const repository = require('./repository')

class ClientesService {
  async getClientes() {
    return repository.getClientes()
  }

  async getClienteById(id) {
    const cliente = await repository.getClienteById(id)
    if (!cliente) throw new Error('Cliente não encontrado')
    return cliente
  }

  async getClientesByBarbearia(barbeariaId) {
    return repository.findByBarbeariaId(Number(barbeariaId))
  }

  async createCliente(data) {
    return repository.createCliente({
      nome: data.nome,
      telefone: data.telefone,
      email: data.email || null,
      aceitaWhatsapp: data.aceitaWhatsapp ?? true,
      statusRelacionamento: data.statusRelacionamento || 'ativo',
      observacoes: data.observacoes || null,
      origem: data.origem || 'manual',
      ultimaVisita: data.ultimaVisita ? new Date(data.ultimaVisita) : null,
      totalGasto: Number(data.totalGasto || 0),
      visitas: Number(data.visitas || 0),
      barbeariaId: Number(data.barbeariaId),
    })
  }

  async findOrCreateClientePublico(data) {
    const existing = await repository.findByPhoneOrEmail(
      Number(data.barbeariaId),
      data.telefone,
      data.email
    )

    if (existing) {
      return repository.updateCliente(existing.id, {
        nome: data.nome || existing.nome,
        telefone: data.telefone || existing.telefone,
        email: data.email || existing.email,
        aceitaWhatsapp: data.aceitaWhatsapp ?? existing.aceitaWhatsapp,
        origem: existing.origem || 'link_publico',
      })
    }

    return this.createCliente({
      ...data,
      origem: data.origem || 'link_publico',
    })
  }

  async updateCliente(id, data) {
    return repository.updateCliente(id, data)
  }

  async deleteCliente(id) {
    return repository.deleteCliente(id)
  }
}

module.exports = new ClientesService()
