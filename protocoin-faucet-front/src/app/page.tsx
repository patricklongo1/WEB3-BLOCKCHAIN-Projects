import MetamaskConnect from './components/MetamaskConnect'
import LinkCards from './components/LinkCards'

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 sm:p-24">
      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#00ffff] after:dark:opacity-40 before:lg:h-[360px]">
        <h1 className="text-4xl text-zinc-900 dark:text-zinc-300 font-extrabold text-shadow text-center w-full">
          New ProtoCoin - NPC
        </h1>
      </div>

      <section className="w-full flex flex-col items-center justify-between p-4 sm:p-24">
        <h2 className="text-2xl sm:text-3xl text-zinc-900 dark:text-zinc-300 font-bold text-shadow text-center">
          Get your FAUCETS ProtoCoins
        </h2>
        <p className="text-zinc-900 dark:text-zinc-300 text-sm mb-6 text-center">
          Once a 24h, earn 0.1 coins for free just connecting your MetaMask
          below.
        </p>
        <MetamaskConnect />
      </section>

      <div className="w-full flex justify-center space-x-10 mb-4 sm:mb-32 text-center lg:mb-0 lg:grid-cols-2 lg:text-left">
        <LinkCards
          href="https://testnet.bscscan.com/address/0xd47964eb2062b555cb76c41ba8823ebddd3c0d41#code"
          title="Contrat"
          content="Verified and published contract at testnet.bscscan."
        />

        <LinkCards
          href="#"
          title="About"
          content="White paper informing the proposal that our ProtoCoin presents to change the world!"
        />
      </div>
    </main>
  )
}
