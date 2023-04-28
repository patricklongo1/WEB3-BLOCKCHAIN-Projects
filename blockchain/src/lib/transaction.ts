import CryptoJS from 'crypto-js'
import TransactionType from './interfaces/transactionType'
import Validation from './validation'

/**
 * Transaction Class
 */
export default class Transaction {
  type: TransactionType
  timestamp: number
  data: string
  hash: string

  /**
   * Transaction constructor
   * @param tx Transaction data
   */
  constructor(tx?: Transaction) {
    this.type = tx?.type || TransactionType.REGULAR
    this.timestamp = tx?.timestamp || Date.now()
    this.data = tx?.data || ''
    this.hash = tx?.hash || this.getHash()
  }

  getHash(): string {
    return CryptoJS.SHA256(
      `${this.type}${this.timestamp}${this.data}${this.data}`,
    ).toString()
  }

  /**
   * Check if tx is valid
   */
  isValid(): Validation {
    if (this.hash !== this.getHash()) {
      return new Validation(false, 'Invalid hash.')
    }

    if (!this.data) {
      return new Validation(false, 'Invalid data.')
    }

    return new Validation()
  }
}
