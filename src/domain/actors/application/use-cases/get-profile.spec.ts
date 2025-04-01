import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { makeUser } from '@/test/factories/make-user'
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository'

import { GetProfileUseCase } from './get-profile'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: GetProfileUseCase

describe('get profile', () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new GetProfileUseCase(inMemoryUsersRepository)
  })

  it('should get user profile', async () => {
    const user = makeUser({ username: 'johndoe' })
    inMemoryUsersRepository.items.push(user)

    const result = await sut.execute({
      userId: user.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      user: expect.objectContaining({ username: 'johndoe' }),
    })
  })

  it('should not get non-existent user profile', async () => {
    const result = await sut.execute({
      userId: 'non-existent-user',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
