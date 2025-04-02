import { BadRequestException, Body, Controller, HttpCode, Post, UnauthorizedException } from '@nestjs/common'

import { AuthenticateUseCase } from '@/domain/actors/application/use-cases/authenticate'
import { WrongCredentialsError } from '@/domain/actors/application/use-cases/errors/wrong-credentials-error'
import { Public } from '@/infra/auth/decorators/public.decorator'

import { BodyDto, bodyValidation } from '../dto/authenticate.dto'

@Public()
@Controller('/sessions')
export class AuthenticateController {
  constructor(private authenticateUseCase: AuthenticateUseCase) {}

  @Post()
  @HttpCode(200)
  async handler(@Body(bodyValidation) body: BodyDto) {
    const { email, password } = body

    const result = await this.authenticateUseCase.execute({
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return {
      access_token: result.value.token,
    }
  }
}
