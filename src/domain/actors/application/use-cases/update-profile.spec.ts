import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { makeUser } from '@/test/factories/make-user'
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository'

import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { UpdateProfileUseCase } from './update-profile'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: UpdateProfileUseCase

describe('update profile', () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new UpdateProfileUseCase(inMemoryUsersRepository)
  })

  it('should update user profile', async () => {
    const user = makeUser()
    inMemoryUsersRepository.items.push(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      name: 'John Doe',
      username: 'johndoe',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      user: expect.objectContaining({ name: 'John Doe', username: 'johndoe' }),
    })

    if (result.isRight()) {
      expect(inMemoryUsersRepository.items[0]).toEqual(result.value.user)
    }
  })

  it('should not update user profile with existing username', async () => {
    const user = makeUser({ username: 'johndoe' })
    inMemoryUsersRepository.items.push(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      username: 'johndoe',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should not update non-existent user profile', async () => {
    const result = await sut.execute({
      userId: 'non-existent-user',
      username: 'johndoe',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
