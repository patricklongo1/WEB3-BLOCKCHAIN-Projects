import TransactionType from '../interfaces/transactionType'
import TransactionInput from './transactionInput'
import Validation from '../validation'

/**
 * Mock Transaction Class
 */
export default class Transaction {
  type: TransactionType
  timestamp: number
  to: string
  txInput: TransactionInput
  hash: string

  /**
   * Mock transaction constructor
   * @param tx transaction
   */
  constructor(tx?: Transaction) {
    this.type = tx?.type || TransactionType.REGULAR
    this.timestamp = tx?.timestamp || Date.now()
    this.to = tx?.to || ''
    this.txInput = tx?.txInput
      ? new TransactionInput(tx.txInput)
      : new TransactionInput()
    this.hash = tx?.hash || this.getHash()
  }

  getHash(): string {
    return this.hash || 'mockhash'
  }

  /**
   * Check if mocked transaction is valid
   * @returns True if it is a valid mock tx
   */
  isValid(): Validation {
    if (!this.to) {
      return new Validation(false, 'Invalid mock transaction: without TO')
    }

    const txInputValidation = this.txInput.isValid()
    if (!txInputValidation.success) {
      return new Validation(
        false,
        `Invalid mock transaction: invalid tx input: ${this.txInput.getHash()}, ${
          txInputValidation.message
        }`,
      )
    }

    return new Validation()
  }
}
