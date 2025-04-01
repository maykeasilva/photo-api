import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { User, UserProps } from '@/domain/actors/enterprise/entities/user'

export function makeUser(override: Partial<UserProps> = {}, id?: UniqueEntityID) {
  const user = User.create(
    {
      name: faker.person.fullName(),
      username: faker.internet.username(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      avatarUrl: faker.datatype.boolean() ? faker.image.personPortrait() : null,

      ...override,
    },
    id,
  )

  return user
}
