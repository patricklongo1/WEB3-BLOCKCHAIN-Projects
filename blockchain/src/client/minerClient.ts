import axios from 'axios'
import BlockInfo from '../lib/interfaces/blockInfo'
import Block from '../lib/block'

const BLOCKCHAIN_SERVER_URL = 'http://localhost:3333'
const minerWalletHash = {
  publicKey: 'minerwalletpublickhash',
  privateKey: 'minerwalletprivatekhash',
}

let totalMined = 0

async function mine() {
  console.log('Getting next block info...')
  const { data } = await axios.get(`${BLOCKCHAIN_SERVER_URL}/blocks/next`)
  const blockInfo = data as BlockInfo

  const newBlock = Block.fromBlockInfo(blockInfo)

  // TO DO: add tx de recompensa

  console.log('Starting mining block #' + blockInfo.index)
  newBlock.mine(blockInfo.difficulty, minerWalletHash.publicKey)

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
