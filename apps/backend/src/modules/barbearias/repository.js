const prisma = require('../../lib/prisma')

class BarbeariasRepository {
  async findAll() {
    return prisma.barbearia.findMany({
      include: {
        servicos: true,
        clientes: true,
      },
      orderBy: { nome: 'asc' },
    })
  }

  async findById(id) {
    return prisma.barbearia.findUnique({
      where: { id },
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
