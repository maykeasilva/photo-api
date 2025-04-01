import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { User } from '../../enterprise/entities/user'
import { UsersRepository } from '../repositories/users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

type UpdateProfileUseCaseRequest = {
  userId: string
  name?: string
  username?: string
}

type UpdateProfileUseCaseResponse = Either<
  ResourceNotFoundError | UserAlreadyExistsError,
  {
    user: User
  }
>

@Injectable()
export class UpdateProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ userId, name, username }: UpdateProfileUseCaseRequest): Promise<UpdateProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    if (username) {
      const userWithSameUsername = await this.usersRepository.findByUsername(username)

      if (userWithSameUsername) {
        return left(new UserAlreadyExistsError(username))
      }
    }

    user.name = name ?? user.name
    user.username = username ?? user.username

    await this.usersRepository.save(user)

    return right({
      user,
    })
  }
}
