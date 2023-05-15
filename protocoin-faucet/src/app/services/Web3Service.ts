import Web3 from 'web3'

const APP_URL = `${process.env.APP_URL}`

export async function connect(): Promise<string[]> {
  if (!window.ethereum) {
    throw new Error('No MetaMask found.')
  }

  const web3 = new Web3(window.ethereum)
  const accounts = await web3.eth.requestAccounts()

  if (!accounts || !accounts.length) {
    throw new Error('No accounts allowed.')
  }

  localStorage.setItem('wallet', accounts[0])
  return accounts
}

export async function mint(account: string): Promise<string> {
  const nextMint = localStorage.getItem('nextMint')
  if (nextMint && parseInt(nextMint) > Date.now()) {
    throw new Error("You can't receive tokens twice in 24h.")
  }

  localStorage.setItem('nextMint', `${Date.now() + 1000 * 60 * 60 * 24}`)

  const response = await fetch(`${APP_URL}/api/mint/${account}`, {
    method: 'POST',
  })

  const data = await response.json()
  return data
}
