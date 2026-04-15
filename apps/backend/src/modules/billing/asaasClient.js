const ASAAS_PRODUCTION_URL = 'https://api.asaas.com/v3'
const ASAAS_SANDBOX_URL = 'https://api-sandbox.asaas.com/v3'

function getAsaasBaseUrl() {
  if (process.env.ASAAS_API_URL) return process.env.ASAAS_API_URL.replace(/\/$/, '')
  return process.env.ASAAS_ENV === 'production' ? ASAAS_PRODUCTION_URL : ASAAS_SANDBOX_URL
}

function getApiKey() {
  return process.env.ASAAS_API_KEY || ''
}

async function request(path, options = {}) {
  const apiKey = getApiKey()
  if (!apiKey) {
    throw new Error('ASAAS_API_KEY não configurada')
  }

  const response = await fetch(`${getAsaasBaseUrl()}${path}`, {
    ...options,
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      access_token: apiKey,
      ...(options.headers || {}),
    },
  })

  const text = await response.text()
  const payload = text ? JSON.parse(text) : null

  if (!response.ok) {
    const message = payload?.errors?.[0]?.description || payload?.message || 'Falha ao comunicar com o Asaas'
    throw new Error(message)
  }

  return payload
}

module.exports = {
  getAsaasBaseUrl,
  request,
}
