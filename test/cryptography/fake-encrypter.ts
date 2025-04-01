import { Encrypter } from '@/domain/actors/application/cryptography/encrypter'

export class FakeEncrypter implements Encrypter {
  async encrypt(payload: { sub: string }): Promise<string> {
    return JSON.stringify(payload)
  }
}
