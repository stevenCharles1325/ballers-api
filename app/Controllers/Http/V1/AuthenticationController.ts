import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Domains/User/Models/User'
import UserCreateValidator from 'App/Domains/User/Validators/UserCreateValidator'

export default class AuthenticationController {
  public async auth ({ auth, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()

    return auth.use('jwt').isAuthenticated
      ? response.ok('Authorized')
      : response.unauthorized('Unauthorized')
  }

  public async login ({ auth, request, response }: HttpContextContract) {
    const { email, password } = request.body()

    try {
      const token = await auth.use('jwt').attempt(email, password)
      return token
    } catch {
      return response.unauthorized('Invalid credentials')
    }
  }

  public async register ({ auth, request, response }: HttpContextContract) {
    const payload = await request.validate(UserCreateValidator)

    try {
      const user = await User.create(payload)
      const token = await auth.use('jwt').generate(user)

      return response.created(token)
    } catch (err) {
      console.log(err)
      return response.internalServerError('Please try again later')
    }
  }

  public async logout ({ auth, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()

    if (auth.use('jwt').isAuthenticated) {
      await auth.use('jwt').revoke()
      return response.ok('Successfully logged out')
    } else {
      return response.unauthorized('Please login first')
    }
  }
}
