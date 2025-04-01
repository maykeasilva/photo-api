import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'

import { Encrypter } from '../cryptography/encrypter'
import { HashComparer } from '../cryptography/hash-comparer'
import { UsersRepository } from '../repositories/users-repository'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

type AuthenticateUseCaseRequest = {
  email: string
  password: string
}

type AuthenticateUseCaseResponse = Either<
  WrongCredentialsError,
  {
    token: string
  }
>

@Injectable()
export class AuthenticateUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hasher: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({ email, password }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      return left(new WrongCredentialsError())
    }

    const doesPasswordMatches = await this.hasher.compare(password, user.password)

    if (!doesPasswordMatches) {
      return left(new WrongCredentialsError())
    }

    const token = await this.encrypter.encrypt({ sub: user.id.toString() })

    return right({
      token,
    })
  }
}
