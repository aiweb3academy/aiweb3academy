import NextImage from 'next-image-export-optimizer'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import actAndInteractWithTheEnvironmentImg from '@/public/images/virtuals/act-and-interact-with-the-environment.png'
import coOwnedByImg from '@/public/images/virtuals/co-owned-by.png'
import infiniteContentImg from '@/public/images/virtuals/infinite-content.png'
import learnPlanAndMakeDecisionImg from '@/public/images/virtuals/learn-plan-and-make-decision.png'
import manageTheirOnchainWalletImg from '@/public/images/virtuals/manage-their-onchain-wallet.png'
import speakAndMoveIn3DSpacesImg from '@/public/images/virtuals/speak-and-move-in-3d-spaces.png'
import synchronizedMemoryAndConsciousnessImg from '@/public/images/virtuals/synchronized-memory-and-consciousness.png'

import { Agents } from './agents'

export function Overview() {
  return (
    <div className="text-center text-[#236D66]">
      <p className="text-3xl lg:text-5xl mb-8">Virtuals：AI 智能体协议/平台</p>
      <p className="text-xl lg:text-3xl mb-40">创建和共同拥有 AI 智能体</p>

      <p className="text-xl lg:text-3xl">正在助力……</p>
      <div className="md:mx-20 mt-4">
        <Agents />
      </div>

      <p className="text-xl lg:text-3xl mt-40 md:mt-80 mb-4">现在就学习怎么创建和共享 AI 智能体</p>
      <Link href="./virtuals/our-one-liner">
        <Button className="text-2xl px-8 h-16 font-bold bg-gradient-to-b from-[#44bcc3] to-[#3dcbd4]">
          开始入门
        </Button>
      </Link>

      <p className="text-xl lg:text-3xl mt-40 md:mt-80">Virtuals 引擎创建</p>
      <p className="text-3xl lg:text-5xl mb-20">自主 AI 智能体</p>

      <p className="mb-4">
        <span className="text-lg lg:text-2xl px-4 py-2 bg-white rounded-2xl">他们在 3D 空间中说话和移动</span>
      </p>
      <div className="relative w-full h-[200px] md:h-[466px]">
        <NextImage
          src={speakAndMoveIn3DSpacesImg}
          alt={'speak-and-move-in-3d-spaces'}
          fill
          className="object-contain"
        />
      </div>

      <p className="mt-20 mb-8">
        <span className="text-lg lg:text-2xl px-4 py-2 bg-white rounded-2xl">他们学习、规划和做决策</span>
      </p>
      <div className="relative w-full h-[200px] md:h-[466px]">
        <NextImage
          src={learnPlanAndMakeDecisionImg}
          alt={'learn-plan-and-make-decision'}
          fill
          className="object-contain"
        />
      </div>

      <p className="mt-20 mb-8">
        <span className="text-lg lg:text-2xl px-4 py-2 bg-white rounded-2xl">他们行动并与环境交互</span>
      </p>
      <div className="relative w-full h-[200px] md:h-[466px]">
        <NextImage
          src={actAndInteractWithTheEnvironmentImg}
          alt={'act-and-interact-with-the-environment'}
          fill
          className="object-contain"
        />
      </div>

      <p className="mt-20 mb-8">
        <span className="text-lg lg:text-2xl px-4 py-2 bg-white rounded-2xl">他们管理自己的链上钱包</span>
      </p>
      <div className="relative w-full h-[200px] md:h-[466px]">
        <NextImage
          src={manageTheirOnchainWalletImg}
          alt={'manage-their-onchain-wallet'}
          fill
          className="object-contain"
        />
      </div>

      <p className="text-xl lg:text-3xl mt-60">为娱乐型应用</p>
      <p className="text-3xl lg:text-5xl mb-8 md:mb-20">带来无限内容</p>

      <div className="relative w-full h-[100px] md:h-[278px]">
        <NextImage src={infiniteContentImg} alt={'infinite-content'} fill className="object-contain" />
      </div>

      <p className="text-xl lg:text-3xl mt-60">利用区块链实现</p>
      <p className="text-3xl lg:text-5xl mb-8 md:mb-12">并行超同步</p>

      <div className="relative w-full h-[120px] md:h-[446px]">
        <NextImage
          src={synchronizedMemoryAndConsciousnessImg}
          alt={'synchronized-memory-and-consciousness'}
          fill
          className="object-contain"
        />
      </div>

      <p className="text-xl lg:text-3xl mt-60">…… 以及</p>
      <p className="text-3xl lg:text-5xl mb-12">智能体共享所有权</p>

      <div className="relative w-full h-[200px] md:h-[462px]">
        <NextImage src={coOwnedByImg} alt={'co-owned-by'} fill className="object-contain" />
      </div>
    </div>
  )
}
