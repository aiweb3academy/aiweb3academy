import { cascadiaMono } from '@/components/fonts'

import { Overview } from './overview'
import { ProtocolStack } from './protocol-stack'

export function Home() {
  return (
    <main
      className={`flex flex-col w-full relative overflow-y-auto bg-gradient-to-br from-[#c5f1f3] to-[#f1ffd5] ${cascadiaMono.className}`}
    >
      <div className="size-full max-w-[1200px] self-center flex flex-col mt-40 mb-10 px-6">
        <Overview />

        <div className="bg-[#404040]/30 h-px min-h-px mt-60 mb-10 opacity-0" style={{ opacity: 1 }}></div>

        <ProtocolStack />
      </div>
    </main>
  )
}
