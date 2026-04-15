const repository = require('./repository')
const { normalizeSlug } = require('../../utils/slug')

async function buildUniqueSlug(value, ignoredBarbeariaId = null) {
  const baseSlug = normalizeSlug(value) || 'barbearia'
  let slug = baseSlug
  let suffix = 2

  while (true) {
    const existing = await repository.findSlugOwner(slug)
    if (!existing || Number(existing.id) === Number(ignoredBarbeariaId)) {
      return slug
    }

    slug = `${baseSlug}-${suffix}`
    suffix += 1
  }
}

class BarbeariasService {
  async getBarbearias(usuarioId = null) {
    return repository.findAll(usuarioId)
  }

  async getBarbeariaById(id, usuarioId = null) {
    const barbearia = await repository.findById(id, usuarioId)
    if (!barbearia) throw new Error('Barbearia não encontrada')
    return barbearia
  }

  async getBarbeariaBySlug(slug) {
    const barbearia = await repository.findBySlug(slug)
    if (!barbearia) throw new Error('Barbearia não encontrada')
    return barbearia
  }

  async createBarbearia(data, usuarioId = null) {
    const nome = String(data.nome || '').trim()
    if (!nome) {
      throw new Error('Nome da barbearia é obrigatório')
    }

    if (usuarioId) {
      const totalBarbearias = await repository.countByUsuarioId(usuarioId)
      if (totalBarbearias > 0) {
        throw new Error('Cada usuário pode cadastrar apenas uma barbearia')
      }
    }

    const slug = await buildUniqueSlug(data.slug || nome)

    return repository.create({
      nome,
      slug,
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
      usuarioId: usuarioId ? Number(usuarioId) : null,
    })
  }

  async updateBarbearia(id, data, usuarioId = null) {
    await this.getBarbeariaById(id, usuarioId)
    if (data.slug || data.nome) {
      data.slug = await buildUniqueSlug(data.slug || data.nome, id)
    }

    delete data.usuarioId

    return repository.update(id, data)
  }

  async deleteBarbearia(id, usuarioId = null) {
    await this.getBarbeariaById(id, usuarioId)
    return repository.delete(id)
  }
}

module.exports = new BarbeariasService()
