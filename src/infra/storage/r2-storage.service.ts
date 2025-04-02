import { randomUUID } from 'node:crypto'

import { DeleteObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common'

import { Deleter, DeleterRequest, DeleterResponse } from '@/domain/actors/application/storage/deleter'
import { Uploader, UploaderRequest, UploaderResponse } from '@/domain/actors/application/storage/uploader'

import { EnvService } from '../env'

@Injectable()
export class R2Storage implements Uploader, Deleter {
  private client: S3Client

  constructor(private envService: EnvService) {
    const accountId = envService.get('CLOUDFLARE_ACCOUNT_ID')

    this.client = new S3Client({
      endpoint: `https://${accountId}.r2.cloudflarestorage.com/`,
      region: 'auto',
      credentials: {
        accessKeyId: envService.get('AWS_ACCESS_TOKEN_ID'),
        secretAccessKey: envService.get('AWS_SECRET_ACCESS_KEY'),
      },
    })
  }

  async upload({ fileName, fileType, body }: UploaderRequest): Promise<UploaderResponse> {
    const uploadId = randomUUID()
    const uniqueFileName = `${uploadId}-${fileName}`

    try {
      await this.client.send(
        new PutObjectCommand({
          Bucket: this.envService.get('AWS_BUCKET_NAME'),
          Key: uniqueFileName,
          ContentType: fileType,
          Body: body,
        }),
      )
    } catch {
      return { url: null, success: false }
    }

    return { url: uniqueFileName, success: true }
  }

  async delete({ fileName }: DeleterRequest): Promise<DeleterResponse> {
    const params = {
      Bucket: this.envService.get('AWS_BUCKET_NAME'),
      Key: fileName,
    }

    try {
      await this.client.send(new HeadObjectCommand(params))
    } catch {
      return { success: false }
    }

    await this.client.send(new DeleteObjectCommand(params))

    return { success: true }
  }
}
