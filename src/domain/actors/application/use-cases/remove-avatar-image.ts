import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Deleter } from '@/domain/actors/application/storage/deleter'

import { UsersRepository } from '../repositories/users-repository'
import { FileOperationError } from './errors/file-operation-error'

type RemoveAvatarImageUseCaseRequest = {
  userId: string
}

type RemoveAvatarImageUseCaseResponse = Either<ResourceNotFoundError | FileOperationError, null>

@Injectable()
export class RemoveAvatarImageUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private deleter: Deleter,
  ) {}

  async execute({ userId }: RemoveAvatarImageUseCaseRequest): Promise<RemoveAvatarImageUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user || !user.avatarUrl) {
      return left(new ResourceNotFoundError())
    }

    const { success } = await this.deleter.delete({ fileName: user.avatarUrl })

    if (!success) {
      return left(new FileOperationError(user.avatarUrl, 'delete'))
    }

    user.avatarUrl = null

    await this.usersRepository.save(user)

    return right(null)
  }
}
