import { z } from 'zod'

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_PRIVATE_KEY: z.string().base64(),
  JWT_PUBLIC_KEY: z.string().base64(),
  CLOUDFLARE_ACCOUNT_ID: z.string(),
  AWS_BUCKET_NAME: z.string(),
  AWS_ACCESS_TOKEN_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  PORT: z.coerce.number().default(3333),
})

export type Env = z.infer<typeof envSchema>
