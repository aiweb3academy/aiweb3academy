import { GoogleAnalytics } from '@next/third-parties/google'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
    </>
  )
}
