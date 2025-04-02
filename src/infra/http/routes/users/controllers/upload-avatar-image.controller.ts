import { BadRequestException, Controller, Patch, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

import { UploadAvatarImageUseCase } from '@/domain/actors/application/use-cases/upload-avatar-image'
import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

import { FileDto, fileValidation } from '../dto/upload-avatar-image.dto'

@Controller('/users/avatar')
export class UploadAvatarImageController {
  constructor(private uploadAvatarImageUseCase: UploadAvatarImageUseCase) {}

  @Patch()
  @UseInterceptors(FileInterceptor('file'))
  async handler(@CurrentUser() user: UserPayload, @UploadedFile(fileValidation) file: FileDto) {
    const { originalname, mimetype, buffer } = file
    const userId = user.sub

    const result = await this.uploadAvatarImageUseCase.execute({
      userId,
      fileName: originalname,
      fileType: mimetype,
      body: buffer,
    })

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message)
    }

    return {
      avatar_url: result.value.url,
    }
  }
}
