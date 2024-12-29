import NextImage from 'next-image-export-optimizer'

export function Home() {
  return (
    <div>
      <div className="fixed w-screen h-[50vh] overflow-hidden z-[-1]">
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
      <div className="h-[50vh] flex justify-center items-center">
        <div className="flex items-center gap-2">
          <NextImage src="/images/cyber-phd/full-size.png" alt="Cyber Ph.D." width={144} height={144} />
          <span className="text-4xl lg:text-7xl text-white font-bold">
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-br from-cyan-700 via-red-500 to-yellow-500 animate-text">
              AI&nbsp;
            </span>
            Academy @Web3
          </span>
        </div>
      </div>
    </div>
  )
}
