const repository = require('./repository')
const barbeariasRepository = require('../barbearias/repository')
const servicosRepository = require('../servicos/repository')
const prisma = require('../../lib/prisma')
const { startOfDay, endOfDay, toDateTime, toHourMinute } = require('../../utils/datetime')

const CANCELLED_STATUSES = new Set(['cancelado'])

function toMinutes(time) {
  const [hour, minute] = String(time || '00:00').split(':').map(Number)
  return hour * 60 + minute
}

function rangesOverlap(startA, endA, startB, endB) {
  return startA < endB && startB < endA
}

function resolveDateTime(data) {
  if (data.time) {
    return toDateTime(data.data, data.time)
  }

  if (!data.data) {
    throw new Error('Data inválida')
  }

  const parsed = new Date(data.data)
  if (Number.isNaN(parsed.getTime())) {
    throw new Error('Data inválida')
  }

  return parsed
}

class AgendamentosService {
  async getAgendamentos(filters = {}, usuarioId = null) {
    const where = {}
    if (filters.barbeariaId) {
      where.barbeariaId = Number(filters.barbeariaId)
    }
    if (usuarioId) {
      where.barbearia = { usuarioId: Number(usuarioId) }
    }

    if (filters.date) {
      const date = toDateTime(filters.date, '00:00')
      where.data = {
        gte: startOfDay(date),
        lte: endOfDay(date),
      }
    }

    return repository.findAll(where)
  }

  async getAgendamentoById(id, usuarioId = null) {
    const agendamento = await repository.findById(id)
    if (!agendamento || (usuarioId && Number(agendamento.barbearia?.usuarioId) !== Number(usuarioId))) {
      throw new Error('Agendamento não encontrado')
    }
    return agendamento
  }

  async getAgendamentosByBarbeariaAndDate(barbeariaId, dateString) {
    const date = dateString ? new Date(dateString) : new Date()
    return repository.findByBarbeariaAndPeriod(
      Number(barbeariaId),
      startOfDay(date),
      endOfDay(date)
    )
  }

  async createAgendamento(data, usuarioId = null) {
    const barbeariaId = Number(data.barbeariaId)
    if (!barbeariaId) throw new Error('Barbearia é obrigatória para cadastrar o agendamento')

    const servico = await servicosRepository.findById(Number(data.servicoId))
    if (!servico) throw new Error('Serviço não encontrado')
    if (Number(servico.barbeariaId) !== barbeariaId) {
      throw new Error('Serviço não encontrado para essa barbearia')
    }

    const barbearia = await barbeariasRepository.findById(barbeariaId, usuarioId)
    if (!barbearia) throw new Error('Barbearia não encontrada')

    const dateTime = resolveDateTime(data)
    await this.validateSlot({
      barbearia,
      servico,
      dateTime,
    })

    return repository.create({
      data: dateTime,
      clienteId: Number(data.clienteId),
      barbeariaId,
      servicoId: Number(data.servicoId),
      status: data.status || 'pendente',
      valorServico: Number(data.valorServico ?? servico.preco ?? 0),
      valorReserva: Number(data.valorReserva ?? servico.depositoAntecipado ?? 0),
      statusPagamento: data.statusPagamento || 'pendente',
      formaPagamentoReserva: data.formaPagamentoReserva || null,
      origem: data.origem || 'manual',
      compareceu: data.compareceu ?? null,
      confirmadoWhatsapp: Boolean(data.confirmadoWhatsapp),
      barbeiroNome: data.barbeiroNome || null,
      observacoes: data.observacoes || null,
    })
  }

  async createPublicAgendamento(barbeariaSlug, payload) {
    const barbearia = await barbeariasRepository.findBySlug(barbeariaSlug)
    if (!barbearia) throw new Error('Barbearia não encontrada')

    return this.createAgendamento({
      ...payload,
      barbeariaId: barbearia.id,
      origem: payload.origem || 'link_publico',
      statusPagamento:
        payload.statusPagamento || (Number(payload.valorReserva || 0) > 0 ? 'pendente' : 'nao_aplicavel'),
    })
  }

  async updateAgendamento(id, data, usuarioId = null) {
    const current = await this.getAgendamentoById(id, usuarioId)
    const payload = { ...data }

    if (payload.data && payload.time) {
      payload.data = toDateTime(payload.data, payload.time)
      delete payload.time
    } else if (payload.data) {
      payload.data = new Date(payload.data)
    }

    const nextBarbeariaId = Number(payload.barbeariaId || current.barbeariaId)
    const nextServicoId = Number(payload.servicoId || current.servicoId)
    const nextDateTime = payload.data ? new Date(payload.data) : current.data
    const status = payload.status || current.status

    if (!CANCELLED_STATUSES.has(status)) {
      const [barbearia, servico] = await Promise.all([
        barbeariasRepository.findById(nextBarbeariaId, usuarioId),
        servicosRepository.findById(nextServicoId),
      ])

      if (!barbearia) throw new Error('Barbearia não encontrada')
      if (!servico) throw new Error('Serviço não encontrado')
      if (Number(servico.barbeariaId) !== nextBarbeariaId) {
        throw new Error('Serviço não encontrado para essa barbearia')
      }

      await this.validateSlot({
        barbearia,
        servico,
        dateTime: nextDateTime,
        ignoreId: id,
      })
    }

    return repository.update(id, payload)
  }

  async deleteAgendamento(id, usuarioId = null) {
    await this.getAgendamentoById(id, usuarioId)
    return repository.delete(id)
  }

  async validateSlot({ barbearia, servico, dateTime, ignoreId = null }) {
    if (Number.isNaN(new Date(dateTime).getTime())) {
      throw new Error('Data inválida')
    }

    const newStart = toMinutes(toHourMinute(dateTime))
    const newEnd = newStart + Number(servico.duracaoMin || 30)
    const openTime = toMinutes(barbearia.horarioAbertura)
    const closeTime = toMinutes(barbearia.horarioFechamento)

    if (newStart < openTime || newEnd > closeTime) {
      throw new Error('Horário fora do expediente da barbearia')
    }

    const dayAppointments = await prisma.agendamento.findMany({
      where: {
        barbeariaId: barbearia.id,
        data: {
          gte: startOfDay(dateTime),
          lte: endOfDay(dateTime),
        },
      },
      include: {
        servico: true,
      },
    })

    const conflicting = dayAppointments.some((item) => {
      if (Number(item.id) === Number(ignoreId) || CANCELLED_STATUSES.has(item.status)) {
        return false
      }

      const appointmentStart = toMinutes(toHourMinute(item.data))
      const appointmentEnd = appointmentStart + Number(item.servico?.duracaoMin || 30)
      return rangesOverlap(newStart, newEnd, appointmentStart, appointmentEnd)
    })

    if (conflicting) {
      throw new Error('Esse horário já foi reservado')
    }
  }
}

module.exports = new AgendamentosService()
