import { UseCaseError } from '@/core/errors/interfaces/use-case-error'

export class FileOperationError extends Error implements UseCaseError {
  constructor(fileName: string, operation: 'upload' | 'delete') {
    super(`Error during file ${operation} operation ${fileName}`)
  }
}
