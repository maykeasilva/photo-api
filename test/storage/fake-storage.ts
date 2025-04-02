import { randomUUID } from 'node:crypto'

import { Deleter, DeleterRequest, DeleterResponse } from '@/domain/actors/application/storage/deleter'
import { Uploader, UploaderRequest, UploaderResponse } from '@/domain/actors/application/storage/uploader'

export class FakeStorage implements Uploader, Deleter {
  public items: { key: string }[] = []

  async upload({ fileName }: UploaderRequest): Promise<UploaderResponse> {
    const uploadId = randomUUID()
    const uniqueFileName = `${uploadId}-${fileName}`

    this.items.push({
      key: uniqueFileName,
    })

    return { url: uniqueFileName, success: true }
  }

  async delete({ fileName }: DeleterRequest): Promise<DeleterResponse> {
    const itemIndex = this.items.findIndex((item) => item.key === fileName)
    this.items.splice(itemIndex, 1)

    return { success: true }
  }
}
