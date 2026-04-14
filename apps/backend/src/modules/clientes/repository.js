const prisma = require('../../lib/prisma')

class ClientesRepository {
  async getClientes(where = {}) {
    return prisma.cliente.findMany({
      where,
      include: {
        barbearia: true,
        agendamentos: {
          include: { servico: true },
          orderBy: { data: 'desc' },
        },
      },
      orderBy: { nome: 'asc' },
    })
  }

  async getClienteById(id) {
    return prisma.cliente.findUnique({
      where: { id },
      include: {
        barbearia: true,
        agendamentos: {
          include: { servico: true },
          orderBy: { data: 'desc' },
        },
      },
    })
  }

  async findByBarbeariaId(barbeariaId) {
    return prisma.cliente.findMany({
      where: { barbeariaId },
      include: {
        agendamentos: {
          include: { servico: true },
          orderBy: { data: 'desc' },
        },
      },
      orderBy: { nome: 'asc' },
    })
  }

  async findByPhoneOrEmail(barbeariaId, telefone, email) {
    const filters = []
    if (telefone) filters.push({ telefone })
    if (email) filters.push({ email })
    if (!filters.length) return null

    return prisma.cliente.findFirst({
      where: {
        barbeariaId,
        OR: filters,
      },
    })
  }

  async createCliente(data) {
    const { barbeariaId, ...rest } = data

    return prisma.cliente.create({
      data: {
        ...rest,
        barbearia: {
          connect: { id: barbeariaId },
        },
      },
    })
  }

  async updateCliente(id, data) {
    const { barbeariaId, ...rest } = data

    return prisma.cliente.update({
      where: { id },
      data: {
        ...rest,
        ...(barbeariaId ? { barbearia: { connect: { id: barbeariaId } } } : {}),
      },
    })
  }

  async deleteCliente(id) {
    return prisma.cliente.delete({
      where: { id },
    })
  }
}

module.exports = new ClientesRepository()
