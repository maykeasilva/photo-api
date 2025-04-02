import { Module } from '@nestjs/common'

import { UsersModule } from './routes/users/users.module'

@Module({
  imports: [UsersModule],
})
export class HttpModule {}
