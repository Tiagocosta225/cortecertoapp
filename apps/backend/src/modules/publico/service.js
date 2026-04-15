const prisma = require('../../lib/prisma')
const barbeariasRepository = require('../barbearias/repository')
const clientesService = require('../clientes/service')
const agendamentosService = require('../agendamentos/service')
const BillingService = require('../billing/service')
const { startOfDay, endOfDay, toDateTime, toHourMinute } = require('../../utils/datetime')

const CANCELLED_STATUSES = new Set(['cancelado'])

function toMinutes(time) {
  const [hour, minute] = String(time || '00:00').split(':').map(Number)
  return hour * 60 + minute
}

function rangesOverlap(startA, endA, startB, endB) {
  return startA < endB && startB < endA
}

function buildSlots(horarioAbertura, horarioFechamento, durationMinutes = 30) {
  const slots = []
  const [openHour, openMinute] = horarioAbertura.split(':').map(Number)
  const [closeHour, closeMinute] = horarioFechamento.split(':').map(Number)
  const current = new Date(Date.UTC(2024, 0, 1, openHour, openMinute, 0, 0))
  const end = new Date(Date.UTC(2024, 0, 1, closeHour, closeMinute, 0, 0))

  while (current.getTime() + durationMinutes * 60 * 1000 <= end.getTime()) {
    slots.push(
      current.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'UTC',
      })
    )
    current.setUTCMinutes(current.getUTCMinutes() + 30)
  }

  return slots
}

function findPublicServico(barbearia, servicoId) {
  if (!servicoId && barbearia.servicos.length) {
    return barbearia.servicos[0]
  }

  return barbearia.servicos.find((servico) => Number(servico.id) === Number(servicoId))
}

async function ensurePublicBookingEnabled(barbearia) {
  const active = await BillingService.hasActiveSubscriptionForBarbearia(barbearia.id)
  if (!active) {
    throw new Error('Assinatura da barbearia inativa')
  }
}

class PublicoService {
  async getBarbeariaPublica(slug) {
    const barbearia = await barbeariasRepository.findBySlug(slug)
    if (!barbearia || !barbearia.ativa) {
      throw new Error('Barbearia não encontrada')
    }
    await ensurePublicBookingEnabled(barbearia)

    const today = new Date()
    const weekStart = startOfDay(today)
    const weekEnd = endOfDay(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6))

    const agendamentosSemana = await prisma.agendamento.findMany({
      where: {
        barbeariaId: barbearia.id,
        data: { gte: weekStart, lte: weekEnd },
      },
    })

    const reservasProtegidas = agendamentosSemana.filter((item) => Number(item.valorReserva) > 0).length
    const faturamentoSemanal = agendamentosSemana.reduce(
      (sum, item) => sum + Number(item.valorServico || 0) + Number(item.valorReserva || 0),
      0
    )

    return {
      id: barbearia.id,
      slug: barbearia.slug,
      nome: barbearia.nome,
      descricao: barbearia.descricao,
      cidade: barbearia.cidade,
      telefone: barbearia.telefone,
      whatsappLink: barbearia.whatsappLink,
      aceitaReservaPix: barbearia.aceitaReservaPix,
      taxaReservaPadrao: barbearia.taxaReservaPadrao,
      horarioAbertura: barbearia.horarioAbertura,
      horarioFechamento: barbearia.horarioFechamento,
      servicos: barbearia.servicos.map((servico) => ({
        id: servico.id,
        nome: servico.nome,
        descricao: servico.descricao,
        preco: servico.preco,
        duracaoMin: servico.duracaoMin,
        depositoAntecipado: servico.depositoAntecipado,
        destaqueLink: servico.destaqueLink,
      })),
      funnel: {
        reservasProtegidas,
        faturamentoSemanal,
      },
    }
  }

  async getAgendaPublica(slug, dateString, servicoId) {
    const barbearia = await barbeariasRepository.findBySlug(slug)
    if (!barbearia || !barbearia.ativa) {
      throw new Error('Barbearia não encontrada')
    }
    await ensurePublicBookingEnabled(barbearia)

    const selectedServico = findPublicServico(barbearia, servicoId)
    if (servicoId && !selectedServico) {
      throw new Error('Serviço não encontrado para essa barbearia')
    }

    const selectedDuration = Number(selectedServico?.duracaoMin || 30)
    const date = dateString ? toDateTime(dateString, '00:00') : new Date()
    const agendamentos = await prisma.agendamento.findMany({
      where: {
        barbeariaId: barbearia.id,
        data: {
          gte: startOfDay(date),
          lte: endOfDay(date),
        },
      },
      include: {
        servico: true,
      },
      orderBy: { data: 'asc' },
    })

    const activeAgendamentos = agendamentos.filter((item) => !CANCELLED_STATUSES.has(item.status))
    const slots = buildSlots(barbearia.horarioAbertura, barbearia.horarioFechamento, selectedDuration).map((time) => {
      const slotStart = toMinutes(time)
      const slotEnd = slotStart + selectedDuration
      const isBooked = activeAgendamentos.some((item) => {
        const appointmentStart = toMinutes(toHourMinute(item.data))
        const appointmentEnd = appointmentStart + Number(item.servico?.duracaoMin || 30)
        return rangesOverlap(slotStart, slotEnd, appointmentStart, appointmentEnd)
      })

      return {
        time,
        disponivel: !isBooked,
        tag: isBooked
          ? 'ocupado'
          : ['11:00', '14:30', '17:00'].includes(time)
            ? 'mais_rentavel'
            : 'disponivel',
      }
    })

    return {
      date: startOfDay(date).toISOString(),
      slug: barbearia.slug,
      servicoId: selectedServico?.id || null,
      slots,
      servicos: barbearia.servicos.map((servico) => ({
        id: servico.id,
        nome: servico.nome,
        preco: servico.preco,
        depositoAntecipado: servico.depositoAntecipado,
      })),
    }
  }

  async criarAgendamentoPublico(slug, payload) {
    const barbearia = await barbeariasRepository.findBySlug(slug)
    if (!barbearia || !barbearia.ativa) {
      throw new Error('Barbearia não encontrada')
    }
    await ensurePublicBookingEnabled(barbearia)

    const servico = findPublicServico(barbearia, payload.servicoId)
    if (!servico) {
      throw new Error('Serviço não encontrado para essa barbearia')
    }

    const dateTime = toDateTime(payload.data, payload.horario)
    if (dateTime < new Date()) {
      throw new Error('Não é possível agendar no passado')
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
    const existing = dayAppointments.some((item) => {
      if (CANCELLED_STATUSES.has(item.status)) {
        return false
      }

      const appointmentStart = toMinutes(toHourMinute(item.data))
      const appointmentEnd = appointmentStart + Number(item.servico?.duracaoMin || 30)
      return rangesOverlap(newStart, newEnd, appointmentStart, appointmentEnd)
    })

    if (existing) {
      throw new Error('Esse horário já foi reservado')
    }

    const cliente = await clientesService.findOrCreateClientePublico({
      nome: payload.nome,
      telefone: payload.telefone,
      email: payload.email || null,
      aceitaWhatsapp: payload.aceitaWhatsapp ?? true,
      barbeariaId: barbearia.id,
    })

    return agendamentosService.createPublicAgendamento(slug, {
      clienteId: cliente.id,
      servicoId: payload.servicoId,
      data: payload.data,
      time: payload.horario,
      status: payload.status || 'confirmado',
      valorReserva: Number(payload.valorReserva || payload.deposito || barbearia.taxaReservaPadrao || 0),
      statusPagamento: payload.statusPagamento || (payload.deposito ? 'aguardando_pix' : 'nao_aplicavel'),
      formaPagamentoReserva: payload.formaPagamentoReserva || (payload.deposito ? 'pix' : null),
      confirmadoWhatsapp: payload.confirmadoWhatsapp ?? true,
      barbeiroNome: payload.barbeiroNome || null,
      observacoes: payload.observacoes || null,
    })
  }
}

module.exports = new PublicoService()
