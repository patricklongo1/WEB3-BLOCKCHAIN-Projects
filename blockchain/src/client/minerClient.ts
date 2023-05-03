import dotenv from 'dotenv'

import axios from 'axios'
import BlockInfo from '../lib/interfaces/blockInfo'
import Block from '../lib/block'
import Wallet from '../lib/wallet'
import Transaction from '../lib/transaction'
import TransactionOutput from '../lib/transactionOutput'
import Blockchain from '../lib/blockchain'
dotenv.config()

const BLOCKCHAIN_SERVER_URL = process.env.BLOCKCHAIN_SERVER_URL
const minerWallet = new Wallet(process.env.MINER_WALLET)
console.log(`Logged as: ${minerWallet.publicKey}`)

let totalMined = 0

function getRewardTx(
  blockInfo: BlockInfo,
  nextBlock: Block,
): Transaction | undefined {
  let amount = 0

  if (blockInfo.difficulty <= blockInfo.maxDifficulty) {
    amount += Blockchain.getRewardAmount(blockInfo.difficulty)
  }

  const fees = nextBlock.transactions
    .map((tx) => tx.getFee())
    .reduce((sum, fee) => sum + fee)
  const feeCheck = nextBlock.transactions.length * blockInfo.feePerTx
  if (fees < feeCheck) {
    console.log('Low fees. Awaiting next block.')
    setTimeout(() => {
      mine()
    }, 5000)

    return
  }
  amount += fees

  const txO = new TransactionOutput({
    toAddress: minerWallet.publicKey,
    amount,
  } as TransactionOutput)

  return Transaction.fromReward(txO)
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
  const tx = getRewardTx(blockInfo, newBlock)
  if (!tx) {
    console.log('No reward transaction create. Waiting next block')
    return setTimeout(() => {
      mine()
    }, 5000)
  }
  newBlock.transactions.push(tx)

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
