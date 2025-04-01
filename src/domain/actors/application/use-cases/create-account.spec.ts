import { FakeHasher } from '@/test/cryptography/fake-hasher'
import { makeUser } from '@/test/factories/make-user'
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository'

import { CreateAccountUseCase } from './create-account'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let inMemoryUsersRepository: InMemoryUsersRepository
let fakeHasher: FakeHasher
let sut: CreateAccountUseCase

describe('create account', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    fakeHasher = new FakeHasher()
    sut = new CreateAccountUseCase(inMemoryUsersRepository, fakeHasher)
  })

  it('should create a new account', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      username: 'johndoe',
      email: 'johndoe@example.com',
      password: '123123',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      user: expect.objectContaining({ email: 'johndoe@example.com' }),
    })

    if (result.isRight()) {
      expect(inMemoryUsersRepository.items[0]).toEqual(result.value.user)
    }
  })

  it('should hashed user password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      username: 'johndoe',
      email: 'johndoe@example.com',
      password: '123123',
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      const passwordHash = result.value.user.password
      const isCorrectlyHashed = await fakeHasher.compare('123123', passwordHash)

      expect(isCorrectlyHashed).toBe(true)
      expect(inMemoryUsersRepository.items[0].password).toEqual(passwordHash)
    }
  })

  it('should not create account with existing email', async () => {
    inMemoryUsersRepository.items.push(makeUser({ email: 'johndoe@example.com' }))

    const result = await sut.execute({
      name: 'John Doe',
      username: 'johndoe',
      email: 'johndoe@example.com',
      password: '123123',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should not create account with existing username', async () => {
    inMemoryUsersRepository.items.push(makeUser({ username: 'johndoe' }))

    const result = await sut.execute({
      name: 'John Doe',
      username: 'johndoe',
      email: 'johndoe@example.com',
      password: '123123',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError)
  })
})
