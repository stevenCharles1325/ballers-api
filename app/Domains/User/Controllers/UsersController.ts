import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Domains/User/Models/User'
import UserUpdateValidator from '../Validators/UserUpdateValidator'

export default class UsersController {
  // For listing all users in admin-side
  // public async index({ auth, request, response }: HttpContextContract) {
  // }

  public async show ({ auth, params, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()

    if (auth.use('jwt').isAuthenticated) {
      const { id } = params

      const user = await User.findOrFail({ id })
      return user
    } else {
      return response.unauthorized('Please login first')
    }
  }

  public async update ({ auth, params, request, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()

    if (auth.use('jwt').isAuthenticated) {
      const { id } = params
      const payload = await request.validate(UserUpdateValidator)

      const user = await User.findOrFail({ id })
      user.merge(payload)

      await user.save()
      return user
    } else {
      return response.unauthorized('Please login first')
    }
  }

  public async destroy ({ auth, params, request, response }: HttpContextContract) {
    await auth.use('jwt').authenticate()

    if (auth.use('jwt').isAuthenticated) {
      const { id } = params
      const { isPermanent = 0 } = request.all()

      const user = await User.findOrFail({ id })

      if (isPermanent) {
        await user.delete()
      } else {
        await user.softDelete()
      }

      return user
    } else {
      return response.unauthorized('Please login first')
    }
  }
}
