const prisma = require('../../lib/prisma')

class ServicosRepository {
  async findAll(where = {}) {
    return prisma.servico.findMany({
      where,
      include: {
        barbearia: true,
        agendamentos: true,
      },
      orderBy: [{ destaqueLink: 'desc' }, { ordemLink: 'asc' }, { nome: 'asc' }],
    })
  }

  async findById(id) {
    return prisma.servico.findUnique({
      where: { id },
      include: {
        barbearia: true,
        agendamentos: true,
      },
    })
  }

  async findByBarbeariaId(barbeariaId) {
    return prisma.servico.findMany({
      where: { barbeariaId },
      include: { agendamentos: true },
      orderBy: [{ destaqueLink: 'desc' }, { ordemLink: 'asc' }, { nome: 'asc' }],
    })
  }

  async create(data) {
    return prisma.servico.create({ data })
  }

  async update(id, data) {
    return prisma.servico.update({ where: { id }, data })
  }

  async delete(id) {
    return prisma.servico.delete({ where: { id } })
  }
}

module.exports = new ServicosRepository()
