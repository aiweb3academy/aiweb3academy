import NextImage from 'next-image-export-optimizer'
import Link from 'next/link'
import { useRouter } from 'nextra/hooks'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const tutorials: {
  logo: string
  title: string
  description: string
  link: string
  bg: string
}[] = [
  {
    logo: 'elizaos.jpg',
    title: 'Eliza 智能体框架',
    description:
      'Eliza 是一个功能强大的多智能体模拟框架，旨在创建、部署和管理自主人工智能智能体。它基于 TypeScript 构建，为开发智能体提供了一个灵活且可扩展的平台。这些智能体能够在多个平台上进行交互，同时保持一致的个性和知识。',
    link: 'eliza',
    bg: 'orange',
  },
  {
    logo: 'virtuals-protocol.svg',
    title: 'Virtuals 协议',
    description:
      'Virtuals 协议正在为游戏和娱乐领域的智能体构建共同所有权层。智能体是未来能够创造收益的资产。这些智能体可以在各种各样的应用程序和游戏中运行，极大地拓展了它们的收益范围。与其他任何能产生价值的资产一样，通过区块链技术，让这些智能体能够被通证化并实现共同拥有。',
    link: 'virtuals',
    bg: 'green',
  },
]

const colorVariants = {
  orange: 'bg-orange-500 hover:bg-orange-600',
  slate: 'bg-slate-500 hover:bg-slate-600',
  green: 'bg-green-500 hover:bg-green-600',
}

export function Tutorials() {
  const router = useRouter()

  return (
    <div className="flex flex-wrap justify-center gap-8">
      {tutorials.map(({ logo, title, description, link, bg }) => (
        <div key={title} className="w-full md:w-96">
          <Link href={`${router.locale ? '/' + router.locale : ''}/${link}`}>
            <Card
              className={`mx-8 md:h-96 ${colorVariants[bg]} border-0 transition ease-in-out duration-300 hover:-translate-y-6`}
            >
              <CardContent className="pt-6">
                <div>
                  <div className="flex justify-start items-center gap-4 h-20">
                    <NextImage src={`/images/${logo}`} alt={title} width={80} height={80} className="rounded-3xl" />
                    <h2 className="text-xl font-bold">{title}</h2>
                  </div>
                  <p className="mt-10 after:content-['_↗']">{description}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      ))}
    </div>
  )
}
