import Game from '@/components/game'
import { RulesDialog } from '@/components/rules-dialog'

export default function IndexPage() {
  return (
    <section className="container mx-auto px-4 py-8">
      <h1 className="mb-6 font-mono text-2xl font-extrabold sm:text-4xl">
        Let&apos;s Play
      </h1>

      <p className="mb-6 text-sm leading-6 sm:text-lg sm:leading-7">
        Here you can check the current game status, play and get fun!
      </p>
      <RulesDialog />
      <Game />
    </section>
  )
}
