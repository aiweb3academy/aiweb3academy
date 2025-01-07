import { NextAuthConfig } from 'next-auth'
import Resend from 'next-auth/providers/resend'

export const authConfig: NextAuthConfig = {
  providers: [
    Resend,
  ],
}
