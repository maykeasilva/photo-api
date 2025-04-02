import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { makeUser } from '@/test/factories/make-user'
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository'
import { FakeStorage } from '@/test/storage/fake-storage'

import { InvalidFileTypeError } from './errors/invalid-file-type-error'
import { UploadAvatarImageUseCase } from './upload-avatar-image'

let inMemoryUsersRepository: InMemoryUsersRepository
let fakeStorage: FakeStorage
let sut: UploadAvatarImageUseCase

describe('upload avatar image', () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    fakeStorage = new FakeStorage()
    sut = new UploadAvatarImageUseCase(inMemoryUsersRepository, fakeStorage)
  })

  it('should upload avatar image', async () => {
    const user = makeUser()
    inMemoryUsersRepository.items.push(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      fileName: 'image',
      fileType: 'image/png',
      body: Buffer.from(''),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({ url: expect.stringContaining('-image') })

    if (result.isRight()) {
      expect(inMemoryUsersRepository.items[0].avatarUrl).toEqual(result.value.url)
    }
  })

  it('should not upload avatar image with invalid file type', async () => {
    const user = makeUser()
    inMemoryUsersRepository.items.push(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      fileName: 'profile.mp3',
      fileType: 'audio/mpeg',
      body: Buffer.from(''),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidFileTypeError)
  })

  it('should not upload avatar image for a non-existent user', async () => {
    const result = await sut.execute({
      userId: 'non-existent-user',
      fileName: 'image',
      fileType: 'image/png',
      body: Buffer.from(''),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
