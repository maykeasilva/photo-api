import { Module } from '@nestjs/common'

import { AuthenticateUseCase } from '@/domain/actors/application/use-cases/authenticate'
import { CreateAccountUseCase } from '@/domain/actors/application/use-cases/create-account'
import { GetProfileUseCase } from '@/domain/actors/application/use-cases/get-profile'
import { GetProfileByUsernameUseCase } from '@/domain/actors/application/use-cases/get-profile-by-username'
import { UpdateProfileUseCase } from '@/domain/actors/application/use-cases/update-profile'
import { CryptographyModule } from '@/infra/cryptography/cryptography.module'
import { DatabaseModule } from '@/infra/database/database.module'

import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { GetProfileController } from './controllers/get-profile.controller'
import { GetProfileByUsernameController } from './controllers/get-profile-by-username.controller'
import { UpdateProfileController } from './controllers/update-profile.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    GetProfileController,
    GetProfileByUsernameController,
    UpdateProfileController,
  ],
  providers: [
    CreateAccountUseCase,
    AuthenticateUseCase,
    GetProfileUseCase,
    GetProfileByUsernameUseCase,
    UpdateProfileUseCase,
  ],
})
export class UsersModule {}
