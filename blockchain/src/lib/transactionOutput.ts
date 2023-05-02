import CryptoJS from 'crypto-js'
import Validation from './validation'

/**
 * TransactionOutput Class
 */
export default class TransactionOutput {
  toAddress: string
  amount: number
  tx?: string

  /**
   * TransactionOutput constructor
   * @param txOutput TransactionOutput?
   */
  constructor(txOutput?: TransactionOutput) {
    this.toAddress = txOutput?.toAddress || ''
    this.amount = txOutput?.amount || 0
    this.tx = txOutput?.tx || ''
  }

  getHash(): string {
    return CryptoJS.SHA256(`${this.toAddress}${this.amount}`).toString()
  }

  isValid(): Validation {
    if (this.amount < 1) {
      return new Validation(false, 'Invalid amount')
    }

    return new Validation()
  }
}
