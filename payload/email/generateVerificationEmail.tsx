import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'
import { render } from '@react-email/render'
import type { PayloadRequest } from 'payload'

import { Members } from '@/payload/collections/Members'

export function generateVerificationEmailSubject({ user }: { user: any }) {
  return `Hi ${user.name}, verify your email address`
}

export function generateVerificationEmailHTML({
  user,
  token,
}: {
  req: PayloadRequest
  token: string
  user: {
    email: string
    username: string
    name: string
  }
}) {
  const inviteLink = `${process.env.PUBLIC_SERVER_URL}/admin/${Members.slug}/verify/${token}`

  return render(
    <Html>
      <Head />
      <Preview>Sign up for your AI Academy @Web3 account</Preview>
      <Tailwind>
        <Body className="bg-white m-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="mt-[32px]">
              <Img
                src="https://aiweb3.academy/images/cyber-phd/nextImageExportOptimizer/full-size-opt-96.WEBP"
                width="96"
                height="96"
                alt="AI Academy @Web3"
                className="my-0 mx-auto"
              />
            </Section>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              <strong>AI Academy @Web3</strong>
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">Hi {user.name},</Text>
            <Text className="text-black text-[14px] leading-[24px]">
              Thanks for signing up! To complete your registration, please verify your email address by clicking the
              link below:
            </Text>
            <Section className="text-center my-[32px]">
              <Button
                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                href={inviteLink}
              >
                Verify your email address
              </Button>
            </Section>
            <Text className="text-black text-[14px] leading-[24px]">
              or copy and paste this URL into your browser:{' '}
              <Link href={inviteLink} className="text-blue-600 no-underline">
                {inviteLink}
              </Link>
            </Text>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              This signing up was intended for <span className="text-black">{user.username}</span>. If you didn't sign
              up for an account, you can safely ignore this email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>,
  )
}
