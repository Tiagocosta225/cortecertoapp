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
  const datePart = String(dateString || '').split('T')[0]
  const [year, month, day] = datePart.split('-').map(Number)
  const [hours = '0', minutes = '0'] = String(timeString || '').split(':')
  const parsedHours = Number(hours)
  const parsedMinutes = Number(minutes)

  if (
    !year ||
    !month ||
    !day ||
    Number.isNaN(parsedHours) ||
    Number.isNaN(parsedMinutes) ||
    parsedHours < 0 ||
    parsedHours > 23 ||
    parsedMinutes < 0 ||
    parsedMinutes > 59
  ) {
    throw new Error('Data inválida')
  }

  const base = new Date(year, month - 1, day, parsedHours, parsedMinutes, 0, 0)
  if (
    Number.isNaN(base.getTime()) ||
    base.getFullYear() !== year ||
    base.getMonth() !== month - 1 ||
    base.getDate() !== day
  ) {
    throw new Error('Data inválida')
  }

  return base
}

function toHourMinute(value) {
  return new Date(value).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

module.exports = {
  startOfDay,
  endOfDay,
  addDays,
  toDateTime,
  toHourMinute,
}
