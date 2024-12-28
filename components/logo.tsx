import NextImage from 'next-image-export-optimizer'

export function Logo() {
  return <div className="flex items-center gap-2">
    <NextImage src="/images/cyber-phd/full-size.png" alt="Cyber Ph.D." width={48} height={48} />
    <div className="flex flex-col text-cyan-700 font-bold">
      <span className="text-xl">
        <span
          className="inline-block text-transparent bg-clip-text bg-gradient-to-br from-cyan-700 via-red-500 to-yellow-500 animate-text">AI</span>
        &nbsp;Academy
        </span>
      <span className="text-sm">@Web3</span>
    </div>
  </div>
}
