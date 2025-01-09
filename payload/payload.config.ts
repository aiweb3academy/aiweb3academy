// storage-adapter-import-placeholder
import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { searchPlugin } from '@payloadcms/plugin-search'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Page, Post } from '@/payload-types'
import { Categories } from '@/payload/collections/Categories'
import { Media } from '@/payload/collections/Media'
import { Members } from '@/payload/collections/Members'
import { Pages } from '@/payload/collections/Pages'
import { Posts } from '@/payload/collections/Posts'
import { defaultLexical } from '@/payload/fields/defaultLexical'
import { revalidateRedirects } from '@/payload/hooks/revalidateRedirects'
import { beforeSyncWithSearch } from '@/payload/search/beforeSync'
import { searchFields } from '@/payload/search/fieldOverrides'
import { getServerSideURL } from '@/payload/utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const generateTitle: GenerateTitle<Post | Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | AI Academy @Web3` : 'AI Academy @Web3'
}

const generateURL: GenerateURL<Post | Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

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
  collections: [Pages, Posts, Media, Categories, Members],
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
    generateSchemaOutputFile: path.resolve(dirname, 'schema.sql'),
    // logger: true,
  }),
  sharp,
  plugins: [
    redirectsPlugin({
      collections: ['pages', 'posts'],
      overrides: {
        // @ts-expect-error: This is a valid override, mapped fields don't resolve to the same type
        fields: ({ defaultFields }) => {
          return defaultFields.map(field => {
            if ('name' in field && field.name === 'from') {
              return {
                ...field,
                admin: {
                  description: 'You will need to rebuild the website when changing this field.',
                },
              }
            }
            return field
          })
        },
        hooks: {
          afterChange: [revalidateRedirects],
        },
      },
    }),
    nestedDocsPlugin({
      collections: ['categories'],
      generateURL: docs => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
    }),
    formBuilderPlugin({
      formOverrides: {
        fields: ({ defaultFields }) => {
          return defaultFields.map(field => {
            if ('name' in field && field.name === 'confirmationMessage') {
              return {
                ...field,
                editor: lexicalEditor({
                  features: ({ rootFeatures }) => {
                    return [
                      ...rootFeatures,
                      FixedToolbarFeature(),
                      HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    ]
                  },
                }),
              }
            }
            return field
          })
        },
      },
    }),
    searchPlugin({
      collections: ['posts'],
      beforeSync: beforeSyncWithSearch,
      searchOverrides: {
        fields: ({ defaultFields }) => {
          return [...defaultFields, ...searchFields]
        },
      },
    }),
    seoPlugin({
      generateTitle,
      generateURL,
    }),
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
  logger: {
    options: { level: 'error' },
    destination: process.stdout,
  },
})
