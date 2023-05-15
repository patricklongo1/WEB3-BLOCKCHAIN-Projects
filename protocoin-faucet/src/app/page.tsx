import MetamaskConnect from './components/MetamaskConnect'
import LinkCards from './components/LinkCards'

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-purple-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-white before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#f2f1f5] after:dark:opacity-40 before:lg:h-[360px]">
        <h1 className="text-4xl text-gray-900 font-extrabold text-shadow">
          New ProtoCoin - NPC
        </h1>
      </div>

      <section className="flex flex-col items-center justify-between p-24">
        <h2 className="text-2xl text-gray-900 font-bold text-shadow">
          Get your FAUCETS ProtoCoins
        </h2>
        <p className="text-gray-900 mb-6">
          Once a 24h, earn 0.01 coins for free just connecting your MetaMask
          below.
        </p>
        <MetamaskConnect />
      </section>

      <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-2 lg:text-left">
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
