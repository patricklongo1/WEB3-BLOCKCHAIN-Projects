import CryptoJS from 'crypto-js'
import Validation from './validation'
import BlockInfo from './interfaces/blockInfo'

/**
 * Block Class
 */
export default class Block {
  index: number
  timestamp: number
  hash: string
  previousHash: string
  data: string
  nonce: number
  miner: string

  /**
   * Block constructor
   * @param block Block data
   */
  constructor(block?: Block) {
    this.index = block?.index || 0
    this.timestamp = block?.timestamp || Date.now()
    this.previousHash = block?.previousHash || ''
    this.data = block?.data || ''
    this.nonce = block?.nonce || 0
    this.miner = block?.miner || ''
    this.hash = block?.hash || this.getHash()
  }

  getHash(): string {
    return CryptoJS.SHA256(
      `${this.index}${this.timestamp}${this.previousHash}${this.data}${this.nonce}${this.miner}`,
    ).toString()
  }

  /**
   * Generates a new valid hash for this block with the specified difficulty
   * @param difficulty The blockchain current difficulty
   * @param miner The block miner wallet address
   */
  mine(difficulty: number, miner: string) {
    this.miner = miner
    const prefix = new Array(difficulty + 1).join('0')

    do {
      this.nonce++
      this.hash = this.getHash()
    } while (!this.hash.startsWith(prefix))
  }

  /**
   * Check if block is valid
   * @param previousHash The previous block hash
   * @param previousIndex The previous block index
   * @param difficulty The blockchain current difficulty
   * @returns True if it is a valid block
   */
  isValid(
    previousHash: string,
    previousIndex: number,
    difficulty: number,
  ): Validation {
    if (previousIndex !== this.index - 1) {
      return new Validation(false, 'Invalid index.')
    }
    if (!this.data) {
      return new Validation(false, 'Invalid data.')
    }
    if (this.timestamp < 1) {
      return new Validation(false, 'Invalid timestamp.')
    }
    if (this.previousHash !== previousHash) {
      return new Validation(false, 'Invalid previousHash.')
    }
    if (!this.nonce || !this.miner) {
      return new Validation(false, 'No mined.')
    }

    const prefix = new Array(difficulty + 1).join('0')
    if (!this.hash.startsWith(prefix) || this.hash !== this.getHash()) {
      return new Validation(false, 'Hash not valid.')
    }
    return new Validation()
  }

  static fromBlockInfo(blockInfo: BlockInfo): Block {
    const block = new Block()
    block.index = blockInfo.index
    block.previousHash = blockInfo.previousHash
    block.data = blockInfo.data
    return block
  }
}
