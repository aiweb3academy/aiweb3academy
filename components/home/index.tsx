import { Tutorials } from '@/components/home/tutorials'

import { Agents } from './agents'
import { Hero } from './hero'

export function Home() {
  return (
    <div>
      <Hero />

      <div className="my-20">
        <Tutorials />
      </div>

      <div className="my-20">
        <Agents />
      </div>
    </div>
  )
}
