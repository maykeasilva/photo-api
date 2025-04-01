import { HashComparer } from '@/domain/actors/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/actors/application/cryptography/hash-generator'

export class FakeHasher implements HashGenerator, HashComparer {
  async hash(plain: string): Promise<string> {
    return plain.concat('-hashed')
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    if (plain.concat('-hashed') === hash) {
      return true
    }

    return false
  }
}
