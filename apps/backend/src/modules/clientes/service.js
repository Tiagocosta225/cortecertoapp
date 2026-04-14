const repository = require('./repository')
const barbeariasRepository = require('../barbearias/repository')

class ClientesService {
  async getClientes(filters = {}) {
    const where = {}
    if (filters.barbeariaId) {
      where.barbeariaId = Number(filters.barbeariaId)
    }

    return repository.getClientes(where)
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
    const nome = String(data.nome || '').trim()
    const telefone = String(data.telefone || '').trim()
    const barbeariaId = Number(data.barbeariaId)

    if (!nome) throw new Error('Nome do cliente é obrigatório')
    if (!telefone) throw new Error('Telefone do cliente é obrigatório')
    if (!barbeariaId) throw new Error('Barbearia é obrigatória para cadastrar o cliente')

    const barbearia = await barbeariasRepository.findById(barbeariaId)
    if (!barbearia) throw new Error('Barbearia não encontrada')

    return repository.createCliente({
      nome,
      telefone,
      email: data.email ? String(data.email).trim() : null,
      aceitaWhatsapp: data.aceitaWhatsapp ?? true,
      statusRelacionamento: data.statusRelacionamento || 'ativo',
      observacoes: data.observacoes || null,
      origem: data.origem || 'manual',
      ultimaVisita: data.ultimaVisita ? new Date(data.ultimaVisita) : null,
      totalGasto: Number(data.totalGasto || 0),
      visitas: Number(data.visitas || 0),
      barbeariaId,
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
    const payload = { ...data }

    if (payload.nome !== undefined) {
      payload.nome = String(payload.nome || '').trim()
      if (!payload.nome) throw new Error('Nome do cliente é obrigatório')
    }

    if (payload.telefone !== undefined) {
      payload.telefone = String(payload.telefone || '').trim()
      if (!payload.telefone) throw new Error('Telefone do cliente é obrigatório')
    }

    if (payload.email !== undefined) {
      payload.email = payload.email ? String(payload.email).trim() : null
    }

    if (payload.barbeariaId !== undefined) {
      payload.barbeariaId = Number(payload.barbeariaId)
      if (!payload.barbeariaId) throw new Error('Barbearia é obrigatória para cadastrar o cliente')
      const barbearia = await barbeariasRepository.findById(payload.barbeariaId)
      if (!barbearia) throw new Error('Barbearia não encontrada')
    }

    if (payload.totalGasto !== undefined) payload.totalGasto = Number(payload.totalGasto || 0)
    if (payload.visitas !== undefined) payload.visitas = Number(payload.visitas || 0)
    if (payload.ultimaVisita) payload.ultimaVisita = new Date(payload.ultimaVisita)

    return repository.updateCliente(id, payload)
  }

  async deleteCliente(id) {
    return repository.deleteCliente(id)
  }
}

module.exports = new ClientesService()
