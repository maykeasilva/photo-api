import { BadRequestException, Controller, Get } from '@nestjs/common'

import { GetProfileUseCase } from '@/domain/actors/application/use-cases/get-profile'
import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

import { UserPresenter } from '../presenters/user.presenter'

@Controller('/me')
export class GetProfileController {
  constructor(private getProfileUseCase: GetProfileUseCase) {}

  @Get()
  async handler(@CurrentUser() user: UserPayload) {
    const userId = user.sub

    const result = await this.getProfileUseCase.execute({ userId })

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message)
    }

    return {
      user: UserPresenter.toHTTP(result.value.user),
    }
  }
}
