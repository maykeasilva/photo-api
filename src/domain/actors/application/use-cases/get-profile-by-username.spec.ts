import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { makeUser } from '@/test/factories/make-user'
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository'

import { GetProfileByUsernameUseCase } from './get-profile-by-username'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: GetProfileByUsernameUseCase

describe('get profile by username', () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new GetProfileByUsernameUseCase(inMemoryUsersRepository)
  })

  it('should get user profile by username', async () => {
    const user = makeUser({ username: 'johndoe' })
    inMemoryUsersRepository.items.push(user)

    const result = await sut.execute({
      username: 'johndoe',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      user: expect.objectContaining({ username: 'johndoe' }),
    })
  })

  it('should not get non-existent user profile', async () => {
    const result = await sut.execute({
      username: 'non-existent-user',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
