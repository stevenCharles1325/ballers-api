import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserCreateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({}, [
      rules.email(),
      rules.unique({ table: 'users', column: 'email' }),
    ]),
    password: schema.string({}, [rules.minLength(8), rules.maxLength(20)]),
    firstName: schema.string({}, [rules.minLength(2)]),
    middleName: schema.string.optional({}),
    lastName: schema.string({}, [rules.minLength(2)]),
    nickname: schema.string({}, [rules.minLength(2), rules.unique({ table: 'users', column: 'nickname' })]),
  })

  public messages: CustomMessages = {
    required: '{{ field }} is required',

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
