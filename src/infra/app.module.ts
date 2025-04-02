import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthModule } from './auth/auth.module'
import { EnvModule, envSchema, EnvService } from './env'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),

    EnvModule,
    AuthModule,
  ],
  providers: [EnvService],
})
export class AppModule {}
