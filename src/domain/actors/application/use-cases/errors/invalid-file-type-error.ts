import { UseCaseError } from './interfaces/use-case-error'

export class InvalidFileTypeError extends Error implements UseCaseError {
  constructor(type: string) {
    super(`File type ${type} is not valid`)
  }
}
