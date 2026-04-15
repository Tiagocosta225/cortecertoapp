const repository = require('./repository')
const barbeariasRepository = require('../barbearias/repository')

function toWholeReais(value) {
  const normalized = String(value ?? '0').includes(',')
    ? String(value ?? '0').replace(/\./g, '').replace(',', '.')
    : String(value ?? '0')
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? Math.max(0, Math.round(parsed)) : 0
}

class ServicosService {
  async getServicos(usuarioId = null) {
    return repository.findAll(usuarioId ? { barbearia: { usuarioId: Number(usuarioId) } } : {})
  }

  async getServicoById(id, usuarioId = null) {
    const servico = await repository.findById(id)
    if (!servico || (usuarioId && Number(servico.barbearia?.usuarioId) !== Number(usuarioId))) {
      throw new Error('Serviço não encontrado')
    }
    return servico
  }

  async getServicosByBarbearia(barbeariaId) {
    return repository.findByBarbeariaId(Number(barbeariaId))
  }

  async createServico(data, usuarioId = null) {
    const nome = String(data.nome || '').trim()
    if (!nome) {
      throw new Error('Nome do serviço é obrigatório')
    }

    const barbeariaId = Number(data.barbeariaId)
    if (!barbeariaId) {
      throw new Error('Barbearia é obrigatória para cadastrar o serviço')
    }

    const barbearia = await barbeariasRepository.findById(barbeariaId, usuarioId)
    if (!barbearia) {
      throw new Error('Barbearia não encontrada')
    }

    return repository.create({
      nome,
      descricao: data.descricao || null,
      preco: toWholeReais(data.preco),
      duracaoMin: Number(data.duracaoMin),
      barbeariaId,
      ativo: data.ativo ?? true,
      destaqueLink: data.destaqueLink ?? false,
      ordemLink: Number(data.ordemLink || 0),
      depositoAntecipado: toWholeReais(data.depositoAntecipado),
      categoria: data.categoria || 'servico',
      tempoRetornoDias: data.tempoRetornoDias ? Number(data.tempoRetornoDias) : null,
    })
  }

  async updateServico(id, data, usuarioId = null) {
    await this.getServicoById(id, usuarioId)
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

      const barbearia = await barbeariasRepository.findById(barbeariaId, usuarioId)
      if (!barbearia) {
        throw new Error('Barbearia não encontrada')
      }

      payload.barbeariaId = barbeariaId
    }

    if (payload.preco !== undefined) payload.preco = toWholeReais(payload.preco)
    if (payload.duracaoMin !== undefined) payload.duracaoMin = Number(payload.duracaoMin)
    if (payload.depositoAntecipado !== undefined) payload.depositoAntecipado = toWholeReais(payload.depositoAntecipado)
    if (payload.ordemLink !== undefined) payload.ordemLink = Number(payload.ordemLink)
    if (payload.tempoRetornoDias !== undefined) {
      payload.tempoRetornoDias = payload.tempoRetornoDias ? Number(payload.tempoRetornoDias) : null
    }

    return repository.update(id, payload)
  }

  async deleteServico(id, usuarioId = null) {
    await this.getServicoById(id, usuarioId)
    return repository.delete(id)
  }
}

module.exports = new ServicosService()
