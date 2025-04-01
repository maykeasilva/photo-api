import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { User } from '../../enterprise/entities/user'
import { UsersRepository } from '../repositories/users-repository'

type GetProfileByUsernameUseCaseRequest = {
  username: string
}

type GetProfileByUsernameUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    user: User
  }
>

@Injectable()
export class GetProfileByUsernameUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ username }: GetProfileByUsernameUseCaseRequest): Promise<GetProfileByUsernameUseCaseResponse> {
    const user = await this.usersRepository.findByUsername(username)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    return right({
      user,
    })
  }
}
