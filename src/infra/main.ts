import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import { EnvService } from './env'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: false,
  })

  const envService = app.get(EnvService)
  await app.listen(envService.get('PORT'))
}
bootstrap()
