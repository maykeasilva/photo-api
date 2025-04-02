import { z } from 'zod'

import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export const bodyValidation = new ZodValidationPipe(bodySchema)

export type BodyDto = z.infer<typeof bodySchema>
