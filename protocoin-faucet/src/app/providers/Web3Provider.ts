import Web3 from 'web3'
import HDWalletProvider from '@truffle/hdwallet-provider'
import { AbiItem } from 'web3-utils'

import ABI from '../abi.json'

const localKeyProvider = new HDWalletProvider({
  privateKeys: [`${process.env.PRIVATE_KEY}`],
  providerOrUrl: `${process.env.BLOCKCHAIN_NODE_URL}`,
}) as any // Type assertion here

const web3 = new Web3(localKeyProvider)

export async function mintAndTransfer(to: string): Promise<string> {
  const contract = new web3.eth.Contract(
    ABI as AbiItem[],
    `${process.env.CONTRACT_ADDRESS}`,
    { from: `${process.env.WALLET_ADDRESS}` },
  )

  const tx = await contract.methods.mint(to).send()
  return tx.transactionHash
}
