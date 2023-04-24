import CryptoJS from 'crypto-js'

/**
 * Block class
 */
export default class Block {
  index: number
  timestamp: number
  hash: string
  previousHash: string
  data: string

  /**
   * Block constructor
   * @param index Block index in Blockchain
   * @param previousHash The previous block hash
   * @param data The block data
   */
  constructor(index: number, previousHash: string, data: string) {
    this.index = index
    this.timestamp = Date.now()
    this.previousHash = previousHash
    this.data = data
    this.hash = this.getHash()
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
  isValid(): boolean {
    if (this.index < 0) return false
    if (!this.hash) return false
    if (!this.data) return false
    if (this.timestamp < 1) return false
    if (!this.previousHash) return false
    return true
  }
}
