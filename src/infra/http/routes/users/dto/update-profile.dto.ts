import { z } from 'zod'

import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'

const bodySchema = z
  .object({
    name: z.string(),
    username: z.string(),
  })
  .partial()

export const bodyValidation = new ZodValidationPipe(bodySchema)

export type BodyDto = z.infer<typeof bodySchema>
