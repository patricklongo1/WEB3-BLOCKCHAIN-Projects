import MetamaskConnectButton from './components/MetamaskConnectButton'
import LinkCards from './components/LinkCards'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-purple before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-purple-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-purple-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#7159c1] after:dark:opacity-40 before:lg:h-[360px]">
        <h1 className="text-4xl text-gray-700 font-extrabold text-shadow">
          New ProtoCoin - NPC
        </h1>
      </div>

      <section className="flex flex-col items-center justify-between p-24">
        <h2 className="text-2xl text-gray-900 font-bold text-shadow">
          Get your faucet ProtoCoins
        </h2>
        <p className="text-gray-900">
          Once a day, earn 1.000 coins for free just connecting your MetaMask
          below.
        </p>
        <MetamaskConnectButton />
      </section>

      <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-2 lg:text-left">
        <LinkCards
          href="https://testnet.bscscan.com/address/0xd47964eb2062b555cb76c41ba8823ebddd3c0d41#code"
          title="Contrato"
          content="Contrato verificado e aprovado na testnet.bscscan."
        />

        <LinkCards
          href="#"
          title="Sobre"
          content=" White paper informando a proposta que nossa ProtoCoin apresenta para
          mudar o mundo!"
        />
      </div>
    </main>
  )
}
