import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { UserFactory } from '@/test/factories/make-user'

let app: INestApplication
let jwt: JwtService
let prisma: PrismaService
let userFactory: UserFactory

describe('remove avatar image', () => {
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)

    await app.init()
  })

  test.skip('[DELETE] /users/avatar', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    await request(app.getHttpServer())
      .patch('/users/avatar')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', './test/utils/e2e/simple-upload.png')

    const response = await request(app.getHttpServer())
      .delete('/users/avatar')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toEqual(204)

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        id: user.id.toString(),
      },
    })

    expect(userOnDatabase).toMatchObject({ avatarUrl: null })
  })
})
