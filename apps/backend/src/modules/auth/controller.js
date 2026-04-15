const AuthService = require('./service')

function getBearerToken(req) {
  const header = req.headers.authorization || ''
  return header.startsWith('Bearer ') ? header.slice(7).trim() : ''
}

class AuthController {
  async register(req, res) {
    const payload = await AuthService.register(req.body)
    res.status(201).json(payload)
  }

  async login(req, res) {
    const payload = await AuthService.login(req.body)
    res.json(payload)
  }

  async me(req, res) {
    const payload = await AuthService.me(getBearerToken(req))
    res.json(payload)
  }

  async logout(req, res) {
    await AuthService.logout(getBearerToken(req))
    res.status(204).send()
  }
}

module.exports = new AuthController()
