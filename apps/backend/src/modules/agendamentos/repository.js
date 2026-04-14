const prisma = require('../../lib/prisma')

class AgendamentosRepository {
  async findAll(where = {}) {
    return prisma.agendamento.findMany({
      where,
      include: {
        cliente: true,
        servico: true,
        barbearia: true,
      },
      orderBy: { data: 'asc' },
    })
  }

  async findById(id) {
    return prisma.agendamento.findUnique({
      where: { id },
      include: {
        cliente: true,
        servico: true,
        barbearia: true,
      },
    })
  }

  async findByBarbeariaAndPeriod(barbeariaId, startDate, endDate) {
    return prisma.agendamento.findMany({
      where: {
        barbeariaId,
        data: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        cliente: true,
        servico: true,
      },
      orderBy: { data: 'asc' },
    })
  }

  async create(data) {
    return prisma.agendamento.create({
      data,
      include: {
        cliente: true,
        servico: true,
        barbearia: true,
      },
    })
  }

  async update(id, data) {
    return prisma.agendamento.update({
      where: { id },
      data,
      include: {
        cliente: true,
        servico: true,
        barbearia: true,
      },
    })
  }

  async delete(id) {
    return prisma.agendamento.delete({ where: { id } })
  }
}

module.exports = new AgendamentosRepository()
