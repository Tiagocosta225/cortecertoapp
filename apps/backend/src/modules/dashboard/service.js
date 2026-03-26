const barbeariasRepository = require('../barbearias/repository')
const agendamentosRepository = require('../agendamentos/repository')
const clientesRepository = require('../clientes/repository')
const servicosRepository = require('../servicos/repository')
const { startOfDay, endOfDay, addDays } = require('../../utils/datetime')

function sumRevenue(agendamentos) {
  return agendamentos.reduce(
    (sum, item) => sum + Number(item.valorServico || 0) + Number(item.valorReserva || 0),
    0
  )
}

function daysBetween(dateA, dateB) {
  const diff = startOfDay(dateA).getTime() - startOfDay(dateB).getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

class DashboardService {
  async getOverview(barbeariaId) {
    const shop = await barbeariasRepository.findById(Number(barbeariaId))
    if (!shop) throw new Error('Barbearia não encontrada')

    const now = new Date()
    const todayStart = startOfDay(now)
    const todayEnd = endOfDay(now)
    const weekEnd = endOfDay(addDays(now, 6))

    const [agendamentosHoje, agendamentosSemana, clientes] = await Promise.all([
      agendamentosRepository.findByBarbeariaAndPeriod(shop.id, todayStart, todayEnd),
      agendamentosRepository.findByBarbeariaAndPeriod(shop.id, todayStart, weekEnd),
      clientesRepository.findByBarbeariaId(shop.id),
    ])

    const clientesEmRisco = clientes.filter((cliente) => {
      if (!cliente.agendamentos.length) return true
      const ultimaVisita = new Date(cliente.agendamentos[0].data)
      return daysBetween(now, ultimaVisita) >= shop.tempoRetornoDias
    })

    return {
      barbearia: {
        id: shop.id,
        nome: shop.nome,
        slug: shop.slug,
      },
      hoje: {
        agendamentos: agendamentosHoje.length,
        reservasProtegidas: agendamentosHoje.filter((item) => Number(item.valorReserva) > 0).length,
        faturamentoPrevisto: sumRevenue(agendamentosHoje),
      },
      semana: {
        faturamento: sumRevenue(agendamentosSemana),
        meta: Number(shop.metaSemanal || 0),
      },
      crm: {
        clientesEmRisco: clientesEmRisco.length,
        clientesReativados: clientes.filter((cliente) => cliente.statusRelacionamento === 'reativado').length,
      },
      antiFuro: {
        protegidos: agendamentosSemana.filter((item) => Number(item.valorReserva) > 0).length,
        pagamentosPendentes: agendamentosSemana.filter((item) => item.statusPagamento === 'aguardando_pix').length,
      },
    }
  }

  async getAgendaInteligente(barbeariaId, dateString, days = 2) {
    const shop = await barbeariasRepository.findById(Number(barbeariaId))
    if (!shop) throw new Error('Barbearia não encontrada')

    const start = dateString ? startOfDay(new Date(dateString)) : startOfDay(new Date())
    const end = endOfDay(addDays(start, Number(days) - 1))
    const agendamentos = await agendamentosRepository.findByBarbeariaAndPeriod(shop.id, start, end)

    const grouped = Array.from({ length: Number(days) }, (_, index) => {
      const date = addDays(start, index)
      const dateKey = startOfDay(date).toISOString()
      const appointments = agendamentos.filter(
        (item) => startOfDay(new Date(item.data)).toISOString() === dateKey
      )

      const revenue = sumRevenue(appointments)
      const freeSlots = Math.max(0, 18 - appointments.length)

      return {
        date: dateKey,
        faturamentoPrevisto: revenue,
        ocupacao: appointments.length,
        slotsLivres: freeSlots,
        recomendacao:
          freeSlots > 6
            ? 'Disparar CRM para preencher baixa ocupação'
            : 'Priorizar serviços premium nos slots restantes',
        agendamentos: appointments.map((item) => ({
          id: item.id,
          horario: new Date(item.data).toISOString(),
          cliente: item.cliente.nome,
          servico: item.servico.nome,
          status: item.status,
          statusPagamento: item.statusPagamento,
          valorTotal: Number(item.valorServico || 0) + Number(item.valorReserva || 0),
        })),
      }
    })

    return {
      barbearia: { id: shop.id, nome: shop.nome },
      dias: grouped,
    }
  }

  async getClientesInsights(barbeariaId) {
    const shop = await barbeariasRepository.findById(Number(barbeariaId))
    if (!shop) throw new Error('Barbearia não encontrada')

    const clientes = await clientesRepository.findByBarbeariaId(shop.id)
    const now = new Date()

    const normalized = clientes.map((cliente) => {
      const agendamentos = cliente.agendamentos
      const totalGasto =
        cliente.totalGasto ||
        agendamentos.reduce((sum, item) => sum + Number(item.valorServico || 0) + Number(item.valorReserva || 0), 0)
      const visitas = cliente.visitas || agendamentos.length
      const ultimaVisita = agendamentos[0] ? new Date(agendamentos[0].data) : null
      const diasSemVoltar = ultimaVisita ? daysBetween(now, ultimaVisita) : null

      return {
        id: cliente.id,
        nome: cliente.nome,
        telefone: cliente.telefone,
        email: cliente.email,
        totalGasto,
        visitas,
        ultimaVisita,
        diasSemVoltar,
        statusRelacionamento: cliente.statusRelacionamento,
      }
    })

    const maisGastam = [...normalized].sort((a, b) => b.totalGasto - a.totalGasto).slice(0, 5)
    const maisVoltam = [...normalized].sort((a, b) => b.visitas - a.visitas).slice(0, 5)
    const emRisco = normalized
      .filter((cliente) => (cliente.diasSemVoltar ?? shop.tempoRetornoDias) >= shop.tempoRetornoDias)
      .sort((a, b) => (b.diasSemVoltar || 0) - (a.diasSemVoltar || 0))
      .slice(0, 10)

    return {
      barbearia: { id: shop.id, nome: shop.nome },
      segmentos: {
        maisGastam,
        maisVoltam,
        emRisco,
      },
      resumo: {
        totalClientes: normalized.length,
        clientesEmRisco: emRisco.length,
      },
    }
  }

  async getServicosInsights(barbeariaId) {
    const shop = await barbeariasRepository.findById(Number(barbeariaId))
    if (!shop) throw new Error('Barbearia não encontrada')

    const servicos = await servicosRepository.findByBarbeariaId(shop.id)
    const items = servicos.map((servico) => {
      const bookings = servico.agendamentos.length
      const receita = servico.agendamentos.reduce(
        (sum, item) => sum + Number(item.valorServico || 0) + Number(item.valorReserva || 0),
        0
      )

      return {
        id: servico.id,
        nome: servico.nome,
        preco: servico.preco,
        depositoAntecipado: servico.depositoAntecipado,
        destaqueLink: servico.destaqueLink,
        bookings,
        receita,
        recomendacao:
          servico.destaqueLink || receita > servico.preco * 5
            ? 'Manter em destaque no link público'
            : 'Testar upsell ou reordenar na vitrine',
      }
    })

    return {
      barbearia: { id: shop.id, nome: shop.nome },
      servicos: items.sort((a, b) => b.receita - a.receita),
    }
  }
}

module.exports = new DashboardService()
