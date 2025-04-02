import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Uploader } from '@/domain/actors/application/storage/uploader'

import { UsersRepository } from '../repositories/users-repository'
import { FileOperationError } from './errors/file-operation-error'
import { InvalidFileTypeError } from './errors/invalid-file-type-error'

type UploadAvatarImageUseCaseRequest = {
  userId: string
  fileName: string
  fileType: string
  body: Buffer
}

type UploadAvatarImageUseCaseResponse = Either<
  ResourceNotFoundError | InvalidFileTypeError | FileOperationError,
  {
    url: string
  }
>

@Injectable()
export class UploadAvatarImageUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    userId,
    fileName,
    fileType,
    body,
  }: UploadAvatarImageUseCaseRequest): Promise<UploadAvatarImageUseCaseResponse> {
    if (!/^(image\/(jpeg|png))$|^application\/pdf$/.test(fileType)) {
      return left(new InvalidFileTypeError(fileType))
    }

    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    const { url, success } = await this.uploader.upload({ fileName, fileType, body })

    if (!success) {
      return left(new FileOperationError(fileName, 'upload'))
    }

    user.avatarUrl = url

    await this.usersRepository.save(user)

    return right({
      url,
    })
  }
}
