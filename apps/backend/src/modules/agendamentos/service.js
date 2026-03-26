const repository = require('./repository')
const barbeariasRepository = require('../barbearias/repository')
const servicosRepository = require('../servicos/repository')
const { startOfDay, endOfDay, toDateTime } = require('../../utils/datetime')

class AgendamentosService {
  async getAgendamentos() {
    return repository.findAll()
  }

  async getAgendamentoById(id) {
    const agendamento = await repository.findById(id)
    if (!agendamento) throw new Error('Agendamento não encontrado')
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

  async createAgendamento(data) {
    const servico = await servicosRepository.findById(Number(data.servicoId))
    if (!servico) throw new Error('Serviço não encontrado')

    return repository.create({
      data: data.time ? toDateTime(data.data, data.time) : new Date(data.data),
      clienteId: Number(data.clienteId),
      barbeariaId: Number(data.barbeariaId),
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

  async updateAgendamento(id, data) {
    const payload = { ...data }

    if (payload.data && payload.time) {
      payload.data = toDateTime(payload.data, payload.time)
      delete payload.time
    } else if (payload.data) {
      payload.data = new Date(payload.data)
    }

    return repository.update(id, payload)
  }

  async deleteAgendamento(id) {
    return repository.delete(id)
  }
}

module.exports = new AgendamentosService()
