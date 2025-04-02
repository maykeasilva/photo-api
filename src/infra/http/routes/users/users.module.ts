import { Module } from '@nestjs/common'

import { AuthenticateUseCase } from '@/domain/actors/application/use-cases/authenticate'
import { CreateAccountUseCase } from '@/domain/actors/application/use-cases/create-account'
import { GetProfileUseCase } from '@/domain/actors/application/use-cases/get-profile'
import { GetProfileByUsernameUseCase } from '@/domain/actors/application/use-cases/get-profile-by-username'
import { RemoveAvatarImageUseCase } from '@/domain/actors/application/use-cases/remove-avatar-image'
import { UpdateProfileUseCase } from '@/domain/actors/application/use-cases/update-profile'
import { UploadAvatarImageUseCase } from '@/domain/actors/application/use-cases/upload-avatar-image'
import { CryptographyModule } from '@/infra/cryptography/cryptography.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { StorageModule } from '@/infra/storage/storage.module'

import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { GetProfileController } from './controllers/get-profile.controller'
import { GetProfileByUsernameController } from './controllers/get-profile-by-username.controller'
import { RemoveAvatarImageController } from './controllers/remove-avatar-image.controller'
import { UpdateProfileController } from './controllers/update-profile.controller'
import { UploadAvatarImageController } from './controllers/upload-avatar-image.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    GetProfileController,
    GetProfileByUsernameController,
    UpdateProfileController,
    UploadAvatarImageController,
    RemoveAvatarImageController,
  ],
  providers: [
    CreateAccountUseCase,
    AuthenticateUseCase,
    GetProfileUseCase,
    GetProfileByUsernameUseCase,
    UpdateProfileUseCase,
    UploadAvatarImageUseCase,
    RemoveAvatarImageUseCase,
  ],
})
export class UsersModule {}
