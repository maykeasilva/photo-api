import { BadRequestException, Body, ConflictException, Controller, Post } from '@nestjs/common'

import { CreateAccountUseCase } from '@/domain/actors/application/use-cases/create-account'
import { UserAlreadyExistsError } from '@/domain/actors/application/use-cases/errors/user-already-exists-error'
import { Public } from '@/infra/auth/decorators/public.decorator'

import { BodyDto, bodyValidation } from '../dto/create-account.dto'

@Public()
@Controller('/accounts')
export class CreateAccountController {
  constructor(private createAccountUseCase: CreateAccountUseCase) {}

  @Post()
  async handler(@Body(bodyValidation) body: BodyDto) {
    const { name, username, email, password } = body

    const result = await this.createAccountUseCase.execute({
      name,
      username,
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case UserAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
