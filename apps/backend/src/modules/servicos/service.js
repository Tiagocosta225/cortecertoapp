const repository = require('./repository')

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
    return repository.create({
      nome: data.nome,
      descricao: data.descricao || null,
      preco: Number(data.preco),
      duracaoMin: Number(data.duracaoMin),
      barbeariaId: Number(data.barbeariaId),
      ativo: data.ativo ?? true,
      destaqueLink: data.destaqueLink ?? false,
      ordemLink: Number(data.ordemLink || 0),
      depositoAntecipado: Number(data.depositoAntecipado || 0),
      categoria: data.categoria || 'servico',
      tempoRetornoDias: data.tempoRetornoDias ? Number(data.tempoRetornoDias) : null,
    })
  }

  async updateServico(id, data) {
    return repository.update(id, data)
  }

  async deleteServico(id) {
    return repository.delete(id)
  }
}

module.exports = new ServicosService()
