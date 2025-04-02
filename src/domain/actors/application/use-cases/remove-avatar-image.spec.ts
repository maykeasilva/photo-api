import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { makeUser } from '@/test/factories/make-user'
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository'
import { FakeStorage } from '@/test/storage/fake-storage'

import { RemoveAvatarImageUseCase } from './remove-avatar-image'

let inMemoryUsersRepository: InMemoryUsersRepository
let fakeStorage: FakeStorage
let sut: RemoveAvatarImageUseCase

describe('remove avatar image', () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    fakeStorage = new FakeStorage()
    sut = new RemoveAvatarImageUseCase(inMemoryUsersRepository, fakeStorage)
  })

  it('should remove avatar image', async () => {
    const file = await fakeStorage.upload({ fileName: 'image', fileType: 'image/png', body: Buffer.from('') })
    const fileName = file.url as string

    const user = makeUser({ avatarUrl: fileName })
    inMemoryUsersRepository.items.push(user)

    const result = await sut.execute({
      userId: user.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toBeNull()

    if (result.isRight()) {
      expect(fakeStorage.items).toHaveLength(0)
      expect(inMemoryUsersRepository.items[0].avatarUrl).toBeNull()
    }
  })

  it('should not remove avatar image for a non-existent user', async () => {
    const result = await sut.execute({
      userId: 'non-existent-user',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
