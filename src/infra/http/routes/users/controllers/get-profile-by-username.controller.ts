import { BadRequestException, Controller, Get, Param } from '@nestjs/common'

import { GetProfileByUsernameUseCase } from '@/domain/actors/application/use-cases/get-profile-by-username'

import { ParamDto, paramValidation } from '../dto/get-profile-by-username.dto'
import { UserPresenter } from '../presenters/user.presenter'

@Controller('/users/:username')
export class GetProfileByUsernameController {
  constructor(private getProfileByUsernameUseCase: GetProfileByUsernameUseCase) {}

  @Get()
  async handler(@Param(paramValidation) param: ParamDto) {
    const { username } = param

    const result = await this.getProfileByUsernameUseCase.execute({ username })

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message)
    }

    return {
      user: UserPresenter.toHTTP(result.value.user),
    }
  }
}
