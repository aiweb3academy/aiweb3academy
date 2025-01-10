import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev'
import { withPayload } from '@payloadcms/next/withPayload'
import nextra from 'nextra'

import { i18n } from './i18n.mjs'

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  defaultShowCopyCode: true,
})

if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform()
}

const preview = process.env.DEPLOYMENT_PREVIEW === 'true'

export default {
  ...withPayload(
    withNextra({
      images: {
        loader: 'custom',
        imageSizes: !preview ? [16, 32, 48, 64, 96, 128, 256, 384] : [16],
        deviceSizes: !preview ? [640, 750, 828, 1080, 1200, 1920, 2048, 3840] : [640],
      },
      transpilePackages: ['next-image-export-optimizer'],
      env: {
        nextImageExportOptimizer_imageFolderPath: 'public/images',
        nextImageExportOptimizer_exportFolderPath: 'out',
        nextImageExportOptimizer_quality: '75',
        nextImageExportOptimizer_storePicturesInWEBP: 'true',
        nextImageExportOptimizer_exportFolderName: 'nextImageExportOptimizer',
        nextImageExportOptimizer_generateAndUseBlurImages: 'true',
        nextImageExportOptimizer_remoteImageCacheTTL: '0',
        NEXT_PUBLIC_GA_ID: process.env.NODE_ENV === 'production' ? 'G-XJTB8V0TW6' : '',
      },
      i18n,
    }),
  ),
}
