import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import ABI from '../abi.json'

const CONTRACT_ADDRESS = `${process.env.CONTRACT_ADDRESS}`

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
  if (!window.ethereum) {
    throw new Error('No MetaMask found.')
  }

  const web3 = new Web3(window.ethereum)
  const contract = new web3.eth.Contract(ABI as AbiItem[], CONTRACT_ADDRESS, {
    from: account,
  })

  const tx = await contract.methods.mint().send()
  return tx.transactionHash
}
