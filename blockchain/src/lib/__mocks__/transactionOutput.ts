import Validation from '../validation'

/**
 * Mock TransactionOutput Class
 */
export default class TransactionOutput {
  toAddress: string
  amount: number
  tx?: string

  /**
   * Mock TransactionOutput constructor
   * @param txOutput TransactionOutput?
   */
  constructor(txOutput?: TransactionOutput) {
    this.toAddress = txOutput?.toAddress || 'mockToAddress'
    this.amount = txOutput?.amount || 10
    this.tx = txOutput?.tx || 'XPTO'
  }

  getHash(): string {
    return 'mockhash'
  }

  isValid(): Validation {
    if (this.amount < 1) {
      return new Validation(false, 'Invalid amount')
    }

    return new Validation()
  }
}
