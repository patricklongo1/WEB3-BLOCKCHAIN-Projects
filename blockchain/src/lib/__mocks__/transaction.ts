import TransactionType from '../interfaces/transactionType'
import Validation from '../validation'

/**
 * Mock Transaction Class
 */
export default class Transaction {
  type: TransactionType
  timestamp: number
  data: string
  hash: string

  /**
   * Mock transaction constructor
   * @param tx transaction
   */
  constructor(tx?: Transaction) {
    this.type = tx?.type || TransactionType.REGULAR
    this.timestamp = tx?.timestamp || Date.now()
    this.data = tx?.data || ''
    this.hash = tx?.hash || this.getHash()
  }

  getHash(): string {
    return this.hash || 'fakehash'
  }

  /**
   * Check if mocked transaction is valid
   * @returns True if it is a valid mock tx
   */
  isValid(): Validation {
    if (!this.data) {
      return new Validation(false, 'Invalid mock transaction.')
    }

    return new Validation()
  }
}
