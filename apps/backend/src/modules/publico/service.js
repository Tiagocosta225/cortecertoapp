const prisma = require('../../lib/prisma')
const barbeariasRepository = require('../barbearias/repository')
const clientesService = require('../clientes/service')
const agendamentosService = require('../agendamentos/service')
const { startOfDay, endOfDay, toDateTime, toHourMinute } = require('../../utils/datetime')

function buildSlots(horarioAbertura, horarioFechamento) {
  const slots = []
  const [openHour, openMinute] = horarioAbertura.split(':').map(Number)
  const [closeHour, closeMinute] = horarioFechamento.split(':').map(Number)
  const current = new Date(Date.UTC(2024, 0, 1, openHour, openMinute, 0, 0))
  const end = new Date(Date.UTC(2024, 0, 1, closeHour, closeMinute, 0, 0))

  while (current < end) {
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

class PublicoService {
  async getBarbeariaPublica(slug) {
    const barbearia = await barbeariasRepository.findBySlug(slug)
    if (!barbearia || !barbearia.ativa) {
      throw new Error('Barbearia não encontrada')
    }

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

  async getAgendaPublica(slug, dateString) {
    const barbearia = await barbeariasRepository.findBySlug(slug)
    if (!barbearia || !barbearia.ativa) {
      throw new Error('Barbearia não encontrada')
    }

    const date = dateString ? new Date(dateString) : new Date()
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

    const bookedTimes = new Set(agendamentos.map((item) => toHourMinute(item.data)))
    const slots = buildSlots(barbearia.horarioAbertura, barbearia.horarioFechamento).map((time) => ({
      time,
      disponivel: !bookedTimes.has(time),
      tag: bookedTimes.has(time)
        ? 'ocupado'
        : ['11:00', '14:30', '17:00'].includes(time)
          ? 'mais_rentavel'
          : 'disponivel',
    }))

    return {
      date: startOfDay(date).toISOString(),
      slug: barbearia.slug,
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

    const cliente = await clientesService.findOrCreateClientePublico({
      nome: payload.nome,
      telefone: payload.telefone,
      email: payload.email || null,
      aceitaWhatsapp: payload.aceitaWhatsapp ?? true,
      barbeariaId: barbearia.id,
    })

    const dateTime = toDateTime(payload.data, payload.horario)
    const existing = await prisma.agendamento.findFirst({
      where: {
        barbeariaId: barbearia.id,
        data: dateTime,
      },
    })

    if (existing) {
      throw new Error('Esse horário já foi reservado')
    }

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
