import { compare, hash } from 'bcryptjs'

import { HashComparer } from '@/domain/actors/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/actors/application/cryptography/hash-generator'

export class BcryptHasher implements HashGenerator, HashComparer {
  private SALT_LENGTH = 8

  async hash(plain: string): Promise<string> {
    return hash(plain, this.SALT_LENGTH)
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash)
  }
}
