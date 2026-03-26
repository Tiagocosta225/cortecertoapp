function startOfDay(date) {
  const next = new Date(date)
  next.setHours(0, 0, 0, 0)
  return next
}

function endOfDay(date) {
  const next = new Date(date)
  next.setHours(23, 59, 59, 999)
  return next
}

function addDays(date, days) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function toDateTime(dateString, timeString) {
  const base = new Date(dateString)
  if (Number.isNaN(base.getTime())) {
    throw new Error('Data inválida')
  }

  const [hours = '0', minutes = '0'] = String(timeString || '').split(':')
  base.setHours(Number(hours), Number(minutes), 0, 0)
  return base
}

function toHourMinute(value) {
  return new Date(value).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  })
}

module.exports = {
  startOfDay,
  endOfDay,
  addDays,
  toDateTime,
  toHourMinute,
}
