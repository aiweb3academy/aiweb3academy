import NextAuth from 'next-auth'
import Resend from 'next-auth/providers/resend'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Resend,
  ],
})
