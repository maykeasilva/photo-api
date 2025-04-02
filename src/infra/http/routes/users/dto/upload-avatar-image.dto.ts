import { FileTypeValidator, MaxFileSizeValidator, ParseFilePipe } from '@nestjs/common'

export const fileValidation = new ParseFilePipe({
  validators: [
    new MaxFileSizeValidator({
      maxSize: 1024 * 1024 * 2, // 2mb
    }),
    new FileTypeValidator({ fileType: '.(png|jpg|jpeg)' }),
  ],
})

export type FileDto = Express.Multer.File
