import CryptoJS from 'crypto-js'
import TransactionType from './interfaces/transactionType'
import Validation from './validation'
import TransactionInput from './transactionInput'

/**
 * Transaction Class
 */
export default class Transaction {
  type: TransactionType
  timestamp: number
  to: string
  txInput: TransactionInput | undefined
  hash: string

  /**
   * Transaction constructor
   * @param tx Transaction data
   */
  constructor(tx?: Transaction) {
    this.type = tx?.type || TransactionType.REGULAR
    this.timestamp = tx?.timestamp || Date.now()
    this.to = tx?.to || ''
    this.txInput = tx?.txInput ? new TransactionInput(tx.txInput) : undefined
    this.hash = tx?.hash || this.getHash()
  }

  getHash(): string {
    const from = this.txInput ? this.txInput.getHash() : ''
    return CryptoJS.SHA256(
      `${this.type}${this.timestamp}${from}${this.to}`,
    ).toString()
  }

  /**
   * Check if tx is valid
   */
  isValid(): Validation {
    if (this.hash !== this.getHash()) {
      return new Validation(false, 'Invalid hash.')
    }

    if (!this.to) {
      return new Validation(false, 'Invalid to.')
    }

    if (this.txInput) {
      const validation = this.txInput.isValid()
      if (!validation.success) {
        return new Validation(false, `Invalid tx: ${validation.message}`)
      }
    }

    return new Validation()
  }
}
