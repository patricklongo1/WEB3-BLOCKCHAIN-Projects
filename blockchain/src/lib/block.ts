import CryptoJS from 'crypto-js'
import Validation from './validation'

/**
 * Block Class
 */
export default class Block {
  index: number
  timestamp: number
  hash: string
  previousHash: string
  data: string

  /**
   * Block constructor
   * @param block Block data
   */
  constructor(block?: Block) {
    this.index = block?.index || 0
    this.timestamp = block?.timestamp || Date.now()
    this.previousHash = block?.previousHash || ''
    this.data = block?.data || ''
    this.hash = block?.hash || this.getHash()
  }

  getHash(): string {
    return CryptoJS.SHA256(
      `${this.index}${this.data}${this.timestamp}${this.previousHash}`,
    ).toString()
  }

  /**
   * Check if block is valid
   * @returns True if it is a valid block
   */
  isValid(previousHash: string, previousIndex: number): Validation {
    if (previousIndex !== this.index - 1)
      return new Validation(false, 'Invalid index.')
    if (this.hash !== this.getHash())
      return new Validation(false, 'Invalid hash.')
    if (!this.data) return new Validation(false, 'Invalid data.')
    if (this.timestamp < 1) return new Validation(false, 'Invalid timestamp.')
    if (this.previousHash !== previousHash)
      return new Validation(false, 'Invalid previousHash.')
    return new Validation()
  }
}
