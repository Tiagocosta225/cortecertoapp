const prisma = require('../../lib/prisma')

class BarbeariasRepository {
  async findAll(usuarioId = null) {
    return prisma.barbearia.findMany({
      where: usuarioId ? { usuarioId: Number(usuarioId) } : undefined,
      include: {
        servicos: true,
        clientes: true,
      },
      orderBy: { nome: 'asc' },
    })
  }

  async findById(id, usuarioId = null) {
    return prisma.barbearia.findFirst({
      where: {
        id,
        ...(usuarioId ? { usuarioId: Number(usuarioId) } : {}),
      },
      include: {
        servicos: { orderBy: [{ destaqueLink: 'desc' }, { ordemLink: 'asc' }] },
        clientes: true,
      },
    })
  }

  async findBySlug(slug) {
    return prisma.barbearia.findUnique({
      where: { slug },
      include: {
        servicos: { where: { ativo: true }, orderBy: [{ destaqueLink: 'desc' }, { ordemLink: 'asc' }] },
      },
    })
  }

  async findSlugOwner(slug) {
    return prisma.barbearia.findUnique({
      where: { slug },
      select: { id: true },
    })
  }

  async countByUsuarioId(usuarioId) {
    return prisma.barbearia.count({
      where: { usuarioId: Number(usuarioId) },
    })
  }

  async create(data) {
    return prisma.barbearia.create({ data })
  }

  async update(id, data) {
    return prisma.barbearia.update({ where: { id }, data })
  }

  async delete(id) {
    return prisma.barbearia.delete({ where: { id } })
  }
}

module.exports = new BarbeariasRepository()
