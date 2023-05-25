import { ethers } from 'ethers'

export async function connect(): Promise<string[]> {
  if (!window.ethereum) {
    throw new Error('No MetaMask found.')
  }

  await window.ethereum.request({ method: 'eth_requestAccounts' })

  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const accounts = await provider.listAccounts()

  if (!accounts || !accounts.length) {
    throw new Error('No accounts allowed.')
  }

  localStorage.setItem('wallet', accounts[0])
  return accounts
}
