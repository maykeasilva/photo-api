import { BadRequestException, Body, ConflictException, Controller, HttpCode, Put } from '@nestjs/common'

import { UserAlreadyExistsError } from '@/domain/actors/application/use-cases/errors/user-already-exists-error'
import { UpdateProfileUseCase } from '@/domain/actors/application/use-cases/update-profile'
import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

import { BodyDto, bodyValidation } from '../dto/update-profile.dto'

@Controller('/users')
export class UpdateProfileController {
  constructor(private updateProfileUseCase: UpdateProfileUseCase) {}

  @Put()
  @HttpCode(204)
  async handler(@CurrentUser() user: UserPayload, @Body(bodyValidation) body: BodyDto) {
    const { name, username } = body
    const userId = user.sub

    const result = await this.updateProfileUseCase.execute({
      userId,
      name,
      username,
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
