import Leaderboard from '@/components/leaderboard'

export default function LeaderboardPage() {
  return (
    <section className="container mx-auto px-4 py-8">
      <h1 className="mb-6 font-mono text-2xl font-extrabold sm:text-4xl">
        Leader board
      </h1>

      <p className="mb-6 text-sm leading-6 sm:text-lg sm:leading-7">
        Here you can check the current leaderboard of JoKenPo!
      </p>

      <Leaderboard />
    </section>
  )
}
