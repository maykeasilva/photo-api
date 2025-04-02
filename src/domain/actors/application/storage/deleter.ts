export type DeleterRequest = {
  fileName: string
}

export type DeleterResponse = {
  success: boolean
}

export abstract class Deleter {
  abstract delete(request: DeleterRequest): Promise<DeleterResponse>
}
