import ABI from './abi.json'
import { ethers } from 'ethers'

type LoginResult = {
  accounts: string[]
  isAdmin: boolean
}

export async function connect(): Promise<LoginResult> {
  if (!window.ethereum) {
    throw new Error('No MetaMask found.')
  }

  await window.ethereum.request({ method: 'eth_requestAccounts' })

  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const accounts = await provider.listAccounts()

  if (!accounts || !accounts.length) {
    throw new Error('No accounts allowed.')
  }

  const contractAddress = `${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}`

  const contract = new ethers.Contract(contractAddress, ABI, provider)

  let owner
  try {
    owner = await contract.owner()
  } catch (error) {
    console.error('Error calling owner():', error)
  }
  const isAdmin = accounts[0] === owner
  localStorage.setItem('wallet', accounts[0])
  localStorage.setItem('isAdmin', isAdmin ? 'true' : 'false')
  return { accounts, isAdmin } as LoginResult
}
