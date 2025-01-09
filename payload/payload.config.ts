import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Categories } from '@/payload/collections/Categories'
import { Media } from '@/payload/collections/Media'
import { Members } from '@/payload/collections/Members'
import { Pages } from '@/payload/collections/Pages'
import { Posts } from '@/payload/collections/Posts'
import { defaultLexical } from '@/payload/fields/defaultLexical'
import { getServerSideURL } from '@/payload/utilities/getURL'

import { migrations } from './migrations'
import { plugins } from './plugins'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Members.slug,
    autoLogin:
      process.env.NEXT_PUBLIC_ENABLE_AUTOLOGIN === 'true'
        ? {
            username: 'admin',
            email: 'admin@aiweb3.academy',
            password: 'admin',
          }
        : false,
    importMap: {
      baseDir: path.resolve(dirname, '..'),
    },
  },
  collections: [Members, Pages, Posts, Media, Categories],
  editor: defaultLexical,
  cors: [getServerSideURL()].filter(Boolean),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: vercelPostgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL || '',
    },
    generateSchemaOutputFile: path.resolve(dirname, 'schema.ts'),
    logger: true,
    migrationDir: path.resolve(dirname, 'migrations'),
    prodMigrations: migrations,
  }),
  sharp,
  upload: {
    limits: {
      fileSize: 5000000, // 5MB, written in bytes
    },
  },
  plugins,
  logger: {
    options: { level: 'error' },
    destination: process.stdout,
  },
})
