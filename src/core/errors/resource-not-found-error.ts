import { UseCaseError } from './interfaces/use-case-error'

export class ResourceNotFoundError extends Error implements UseCaseError {
  constructor() {
    super('Resource not found')
  }
}
