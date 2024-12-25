import nextra from 'nextra'
import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev'

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
})

if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform()
}

export default withNextra()
