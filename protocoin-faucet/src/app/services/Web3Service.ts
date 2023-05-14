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

  return accounts
}

export async function mint(account: string): Promise<string> {
  const response = await fetch(`${APP_URL}/api/mint/${account}`, {
    method: 'POST',
  })

  const data = await response.json()
  console.log(data)
  return data
}
