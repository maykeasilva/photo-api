import { BadRequestException, Controller, Delete, HttpCode } from '@nestjs/common'

import { RemoveAvatarImageUseCase } from '@/domain/actors/application/use-cases/remove-avatar-image'
import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

@Controller('/users/avatar')
export class RemoveAvatarImageController {
  constructor(private removeAvatarImageUseCase: RemoveAvatarImageUseCase) {}

  @Delete()
  @HttpCode(204)
  async handler(@CurrentUser() user: UserPayload) {
    const userId = user.sub

    const result = await this.removeAvatarImageUseCase.execute({
      userId,
    })

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message)
    }
  }
}
