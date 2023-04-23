import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, manyToMany, ManyToMany, computed } from '@ioc:Adonis/Lucid/Orm'
import Role from '../../../Models/Role'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken: string | null

  @column()
  public firstName: string

  @column()
  public lastName: string

  @column()
  public middleName: string | null

  @column()
  public nickname: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({ autoCreate: true })
  public deletedAt: DateTime

  @manyToMany(() => Role, {
    pivotTable: 'role_users',
  })
  public roles: ManyToMany<typeof Role>

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @computed()
  public get fullName () {
    if (this.middleName?.length) {
      return `${this.firstName} ${this.middleName} ${this.lastName}`
    } else {
      return `${this.firstName} ${this.lastName}`
    }
  }

  public async softDelete () {
    this.deletedAt = DateTime.now()

    await this.save()
    await this.refresh()
  }
}
