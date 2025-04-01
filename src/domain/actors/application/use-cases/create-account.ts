import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'

import { User } from '../../enterprise/entities/user'
import { HashGenerator } from '../cryptography/hash-generator'
import { UsersRepository } from '../repositories/users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

type CreateAccountUseCaseRequest = {
  name: string
  username: string
  email: string
  password: string
}

type CreateAccountUseCaseResponse = Either<
  UserAlreadyExistsError,
  {
    user: User
  }
>

@Injectable()
export class CreateAccountUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hasher: HashGenerator,
  ) {}

  async execute({
    name,
    username,
    email,
    password,
  }: CreateAccountUseCaseRequest): Promise<CreateAccountUseCaseResponse> {
    const userWithSameUsername = await this.usersRepository.findByUsername(username)

    if (userWithSameUsername) {
      return left(new UserAlreadyExistsError(username))
    }

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      return left(new UserAlreadyExistsError(email))
    }

    const passwordHash = await this.hasher.hash(password)

    const user = User.create({
      name,
      username,
      email,
      password: passwordHash,
    })

    await this.usersRepository.create(user)

    return right({
      user,
    })
  }
}
