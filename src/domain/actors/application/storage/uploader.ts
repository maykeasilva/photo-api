export type UploaderRequest = {
  fileName: string
  fileType: string
  body: Buffer
}

export type UploaderResponse =
  | {
      url: string
      success: true
    }
  | {
      url: null
      success: false
    }

export abstract class Uploader {
  abstract upload(request: UploaderRequest): Promise<UploaderResponse>
}
