const repository = require('./repository')
const { normalizeSlug } = require('../../utils/slug')

class BarbeariasService {
  async getBarbearias() {
    return repository.findAll()
  }

  async getBarbeariaById(id) {
    const barbearia = await repository.findById(id)
    if (!barbearia) throw new Error('Barbearia não encontrada')
    return barbearia
  }

  async getBarbeariaBySlug(slug) {
    const barbearia = await repository.findBySlug(slug)
    if (!barbearia) throw new Error('Barbearia não encontrada')
    return barbearia
  }

  async createBarbearia(data) {
    const nome = String(data.nome || '').trim()
    if (!nome) {
      throw new Error('Nome da barbearia é obrigatório')
    }

    return repository.create({
      nome,
      slug: normalizeSlug(data.slug || nome),
      endereco: data.endereco || '',
      telefone: data.telefone || '',
      descricao: data.descricao || null,
      cidade: data.cidade || null,
      instagram: data.instagram || null,
      whatsappLink: data.whatsappLink || null,
      logoUrl: data.logoUrl || null,
      horarioAbertura: data.horarioAbertura || '09:00',
      horarioFechamento: data.horarioFechamento || '19:00',
      ativa: data.ativa ?? true,
      aceitaReservaPix: data.aceitaReservaPix ?? true,
      taxaReservaPadrao: Number(data.taxaReservaPadrao || 0),
      tempoRetornoDias: Number(data.tempoRetornoDias || 20),
      metaSemanal: Number(data.metaSemanal || 0),
    })
  }

  async updateBarbearia(id, data) {
    if (data.slug || data.nome) {
      data.slug = normalizeSlug(data.slug || data.nome)
    }

    return repository.update(id, data)
  }

  async deleteBarbearia(id) {
    return repository.delete(id)
  }
}

module.exports = new BarbeariasService()
