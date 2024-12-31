import NextImage from 'next-image-export-optimizer'
import { ReactTyped } from 'react-typed'

export function Hero() {
  return (
    <div className="relative">
      <div className="absolute w-screen h-[50vh] overflow-hidden z-0">
        <NextImage
          src="/images/academy.png"
          alt="Academy"
          placeholder="blur"
          fill
          sizes="100vw"
          style={{
            objectFit: 'cover',
          }}
        />
      </div>
      <div className="relative h-[50vh] flex flex-col justify-center items-center gap-12 z-10 mx-8">
        <div className="flex items-center gap-2">
          <NextImage src="/images/cyber-phd/full-size.png" alt="Cyber Ph.D." width={144} height={144} />
          <span className="text-4xl lg:text-7xl text-white font-bold">
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-br from-cyan-700 via-red-500 to-yellow-500 animate-text">
              AI&nbsp;
            </span>
            Academy @Web3
          </span>
        </div>
        <p className="text-lg lg:text-2xl text-white h-12">
          <ReactTyped
            strings={[
              '连接 AI 与 Crypto',
              'AI + Web3 = 未来',
              '为你提供全面的 AI + Web3 教程、新闻、投研分析和工具资源!',
            ]}
            typeSpeed={80}
            loop={true}
          />
        </p>
      </div>
    </div>
  )
}
