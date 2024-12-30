import NextImage from 'next-image-export-optimizer'
import Marquee from 'react-fast-marquee'

export function Agents() {
  return (
    <Marquee autoFill>
      {[
        ['ai16z.avif', 'ai16z'],
        ['virtuals-protocol.svg', 'Virtuals Protocol'],
        ['elizaos.avif', 'ElizaOS'],
        ['ELIZA.webp', 'Eliza'],
        ['G.A.M.E.png', 'G.A.M.E'],
        ['luna.png', 'Luna'],
        ['aixbt.png', 'aixbt'],
        ['convo.png', 'Prefrontal Cortex Convo Agent'],
        ['vader.jpeg', 'VaderAI'],
        ['aixcb.png', 'aixCB'],
        ['spore.webp', 'Spore'],
      ].map(([filename, name]) => (
        <div key={filename} className="w-32 h-20 flex justify-center items-center">
          <NextImage src={`/images/${filename}`} alt={name} width={80} height={80} className="rounded-3xl" />
        </div>
      ))}
    </Marquee>
  )
}
