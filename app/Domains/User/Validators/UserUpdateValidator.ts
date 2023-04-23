import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string.optional({}, [
      rules.email(),
      rules.unique({ table: 'users', column: 'email' }),
    ]),
    password: schema.string.optional({}, [rules.minLength(8), rules.maxLength(20)]),
    firstName: schema.string.optional({}, [rules.minLength(2)]),
    middleName: schema.string.optional({}),
    lastName: schema.string.optional({}, [rules.minLength(2)]),
    nickname: schema.string.optional({}, [rules.minLength(2), rules.unique({ table: 'users', column: 'nickname' })]),
  })

  public messages: CustomMessages = {
    'firstName.minLength': 'First name must be at least {{ options.minLength }} characters',
    'lastName.minLength': 'Last name must be at least {{ options.minLength }} characters',

    'nickname.minLength': 'Nickname must be at least {{ options.minLength }} characters',
    'nickname.unique': 'Nickname must be unique',

    'password.minLength': 'Password must be at least {{ options.minLength }} characters',
    'password.maxLength': 'Password must be at maximum {{ options.maxLength }} characters',

    'email.unique': 'Email must be unique',
    'email.email': 'Email must be a valid email address',
  }
}
