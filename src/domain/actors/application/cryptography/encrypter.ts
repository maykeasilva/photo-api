export abstract class Encrypter {
  abstract encrypt(payload: { sub: string }): Promise<string>
}
