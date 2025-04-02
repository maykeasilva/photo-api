import { z } from 'zod'

import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'

const paramSchema = z.object({
  username: z.string(),
})

export const paramValidation = new ZodValidationPipe(paramSchema)

export type ParamDto = z.infer<typeof paramSchema>
