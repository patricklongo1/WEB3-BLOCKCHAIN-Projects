import TransactionType from '../interfaces/transactionType'
import Validation from '../validation'
import TransactionInput from './transactionInput'
import TransactionOutput from './transactionOutput'

/**
 * Mock Transaction Class
 */
export default class Transaction {
  type: TransactionType
  timestamp: number
  txInputs: TransactionInput[] | undefined
  txOutputs: TransactionOutput[]
  hash: string

  /**
   * Mock transaction constructor
   * @param tx transaction
   */
  constructor(tx?: Transaction) {
    this.type = tx?.type || TransactionType.REGULAR
    this.timestamp = tx?.timestamp || Date.now()
    this.txOutputs = tx?.txOutputs || [new TransactionOutput()]
    this.txInputs = tx?.txInputs || [new TransactionInput()]
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
    if (this.timestamp < 1 || !this.hash) {
      return new Validation(false, 'Invalid mock transaction')
    }

    return new Validation()
  }
}
