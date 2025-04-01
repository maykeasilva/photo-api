import { FakeEncrypter } from '@/test/cryptography/fake-encrypter'
import { FakeHasher } from '@/test/cryptography/fake-hasher'
import { makeUser } from '@/test/factories/make-user'
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository'

import { AuthenticateUseCase } from './authenticate'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

let inMemoryUsersRepository: InMemoryUsersRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateUseCase

describe('authenticate', () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    sut = new AuthenticateUseCase(inMemoryUsersRepository, fakeHasher, fakeEncrypter)

    inMemoryUsersRepository.items.push(
      makeUser({ email: 'johndoe@example.com', password: await fakeHasher.hash('123123') }),
    )
  })

  it('should authenticate a user', async () => {
    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: '123123',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({ token: expect.any(String) })
  })

  it('should not authenticate a user with wrong email', async () => {
    const result = await sut.execute({
      email: 'wrong-email@example.com',
      password: '123123',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })

  it('should not authenticate a user with wrong password', async () => {
    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: 'wrong-password',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })
})
