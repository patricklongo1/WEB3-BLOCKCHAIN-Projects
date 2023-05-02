import dotenv from 'dotenv'

import axios from 'axios'
import BlockInfo from '../lib/interfaces/blockInfo'
import Block from '../lib/block'
import Wallet from '../lib/wallet'
import Transaction from '../lib/transaction'
import TransactionType from '../lib/interfaces/transactionType'
import TransactionOutput from '../lib/transactionOutput'
dotenv.config()

const BLOCKCHAIN_SERVER_URL = process.env.BLOCKCHAIN_SERVER_URL
const minerWallet = new Wallet(process.env.MINER_WALLET)
console.log(`Logged as: ${minerWallet.publicKey}`)

let totalMined = 0

function getRewardTx(): Transaction {
  const txO = new TransactionOutput({
    toAddress: minerWallet.publicKey,
    amount: 10,
  } as TransactionOutput)

  const tx = new Transaction({
    txOutputs: [txO],
    type: TransactionType.FEE,
  } as Transaction)

  tx.hash = tx.getHash()
  tx.txOutputs[0].tx = tx.hash

  return tx
}

async function mine() {
  console.log('Getting next block info...')
  const { data } = await axios.get(`${BLOCKCHAIN_SERVER_URL}/blocks/next`)
  if (!data) {
    console.log('No tx found. recheck in 5s')
    return setTimeout(() => {
      mine()
    }, 5000)
  }
  const blockInfo = data as BlockInfo

  const newBlock = Block.fromBlockInfo(blockInfo)
  newBlock.transactions.push(getRewardTx())

  newBlock.miner = minerWallet.publicKey
  newBlock.hash = newBlock.getHash()

  console.log('Starting mining block #' + blockInfo.index)
  newBlock.mine(blockInfo.difficulty, minerWallet.publicKey)

  console.log('Block mined! Sending to blockchain...')

  try {
    await axios.post(`${BLOCKCHAIN_SERVER_URL}/blocks`, newBlock)
    console.log('Block sent and accepted!')
    totalMined++
    console.log('Total mined blocks: ' + totalMined)
  } catch (error: any) {
    console.error(error.response ? error.response.data : error.message)
  }

  setTimeout(() => {
    mine()
  }, 1000)
}

mine()
