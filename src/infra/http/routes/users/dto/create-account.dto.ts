import { z } from 'zod'

import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'

const bodySchema = z.object({
  name: z.string(),
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(8).max(128),
})

export const bodyValidation = new ZodValidationPipe(bodySchema)

export type BodyDto = z.infer<typeof bodySchema>
