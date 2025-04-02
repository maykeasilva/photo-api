import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { UserFactory } from '@/test/factories/make-user'

let app: INestApplication
let jwt: JwtService
let userFactory: UserFactory

describe('get profile', () => {
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    userFactory = moduleRef.get(UserFactory)

    await app.init()
  })

  test('[GET] /me', async () => {
    const user = await userFactory.makePrismaUser({ username: 'johndoe' })
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer()).get('/me').set('Authorization', `Bearer ${accessToken}`).send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      user: expect.objectContaining({ id: expect.any(String), username: 'johndoe' }),
    })
  })
})
