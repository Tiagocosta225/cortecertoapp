const repository = require('./repository')
const barbeariasRepository = require('../barbearias/repository')

class ServicosService {
  async getServicos() {
    return repository.findAll()
  }

  async getServicoById(id) {
    const servico = await repository.findById(id)
    if (!servico) throw new Error('Serviço não encontrado')
    return servico
  }

  async getServicosByBarbearia(barbeariaId) {
    return repository.findByBarbeariaId(Number(barbeariaId))
  }

  async createServico(data) {
    const nome = String(data.nome || '').trim()
    if (!nome) {
      throw new Error('Nome do serviço é obrigatório')
    }

    const barbeariaId = Number(data.barbeariaId)
    if (!barbeariaId) {
      throw new Error('Barbearia é obrigatória para cadastrar o serviço')
    }

    const barbearia = await barbeariasRepository.findById(barbeariaId)
    if (!barbearia) {
      throw new Error('Barbearia não encontrada')
    }

    return repository.create({
      nome,
      descricao: data.descricao || null,
      preco: Number(data.preco),
      duracaoMin: Number(data.duracaoMin),
      barbeariaId,
      ativo: data.ativo ?? true,
      destaqueLink: data.destaqueLink ?? false,
      ordemLink: Number(data.ordemLink || 0),
      depositoAntecipado: Number(data.depositoAntecipado || 0),
      categoria: data.categoria || 'servico',
      tempoRetornoDias: data.tempoRetornoDias ? Number(data.tempoRetornoDias) : null,
    })
  }

  async updateServico(id, data) {
    const payload = { ...data }

    if (payload.nome !== undefined) {
      payload.nome = String(payload.nome || '').trim()
      if (!payload.nome) {
        throw new Error('Nome do serviço é obrigatório')
      }
    }

    if (payload.barbeariaId !== undefined) {
      const barbeariaId = Number(payload.barbeariaId)
      if (!barbeariaId) {
        throw new Error('Barbearia é obrigatória para cadastrar o serviço')
      }

      const barbearia = await barbeariasRepository.findById(barbeariaId)
      if (!barbearia) {
        throw new Error('Barbearia não encontrada')
      }

      payload.barbeariaId = barbeariaId
    }

    if (payload.preco !== undefined) payload.preco = Number(payload.preco)
    if (payload.duracaoMin !== undefined) payload.duracaoMin = Number(payload.duracaoMin)
    if (payload.depositoAntecipado !== undefined) payload.depositoAntecipado = Number(payload.depositoAntecipado)
    if (payload.ordemLink !== undefined) payload.ordemLink = Number(payload.ordemLink)
    if (payload.tempoRetornoDias !== undefined) {
      payload.tempoRetornoDias = payload.tempoRetornoDias ? Number(payload.tempoRetornoDias) : null
    }

    return repository.update(id, payload)
  }

  async deleteServico(id) {
    return repository.delete(id)
  }
}

module.exports = new ServicosService()
