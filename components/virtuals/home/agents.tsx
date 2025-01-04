import NextImage from 'next-image-export-optimizer'
import Marquee from 'react-fast-marquee'

export function Agents() {
  return (
    <Marquee autoFill speed={100}>
      {[
        'roblox.svg',
        'aidol.svg',
        'tiktok.svg',
        'unity.svg',
        'aikoi.png',
        'sanctum.png',
        'ton.svg',
      ].map(filename => (
        <div key={filename} className="w-16 h-12 md:w-44 md:h-32 flex justify-center items-center">
          <NextImage
            src={`/images/virtuals/${filename}`}
            alt={filename}
            width={128}
            height={128}
            className="size-12 md:size-32"
          />
        </div>
      ))}
    </Marquee>
  )
}
