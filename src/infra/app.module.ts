import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { EnvModule, envSchema, EnvService } from './env'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),

    EnvModule,
  ],
  providers: [EnvService],
})
export class AppModule {}
