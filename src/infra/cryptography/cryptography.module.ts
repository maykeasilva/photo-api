import { Module } from '@nestjs/common'

import { Encrypter } from '@/domain/actors/application/cryptography/encrypter'
import { HashComparer } from '@/domain/actors/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/actors/application/cryptography/hash-generator'

import { BcryptHasher } from './bcrypt/bcrypt-hasher.service'
import { JwtEncrypter } from './jwt/jwt-encrypter.service'

@Module({
  providers: [
    { provide: Encrypter, useClass: JwtEncrypter },
    { provide: HashGenerator, useClass: BcryptHasher },
    { provide: HashComparer, useClass: BcryptHasher },
  ],
  exports: [Encrypter, HashGenerator, HashComparer],
})
export class CryptographyModule {}
