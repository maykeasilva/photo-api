import { Module } from '@nestjs/common'

import { Deleter } from '@/domain/actors/application/storage/deleter'
import { Uploader } from '@/domain/actors/application/storage/uploader'

import { EnvModule } from '../env'
import { R2Storage } from './r2-storage.service'

@Module({
  imports: [EnvModule],
  providers: [
    { provide: Uploader, useClass: R2Storage },
    { provide: Deleter, useClass: R2Storage },
  ],
  exports: [Uploader, Deleter],
})
export class StorageModule {}
