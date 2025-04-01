import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'

import { config } from 'dotenv'

config({ path: '.env', override: true })
config({ path: '.env.test', override: true })

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const uniqueSchemaID = randomUUID()

beforeAll(async () => {
  const databaseURL = new URL(process.env.DATABASE_URL!)
  databaseURL.searchParams.set('schema', uniqueSchemaID)
  process.env.DATABASE_URL = databaseURL.toString()

  execSync('pnpm prisma migrate deploy')
})

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${uniqueSchemaID}" CASCADE`)
  await prisma.$disconnect()
})
