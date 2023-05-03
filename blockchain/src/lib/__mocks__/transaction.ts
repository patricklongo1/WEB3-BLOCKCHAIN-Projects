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

  getFee(): number {
    if (this.txInputs && this.txInputs.length) {
      return 1
    }
    return 0
  }

  isValid(difficulty: number, totalFees: number): Validation {
    if (this.timestamp < 1 || !this.hash || difficulty < 1 || totalFees < 0) {
      return new Validation(false, 'Invalid mock transaction')
    }

    return new Validation()
  }

  static fromReward(txO: TransactionOutput): Transaction {
    const tx = new Transaction({
      type: TransactionType.FEE,
      txOutputs: [txO],
    } as Transaction)

    tx.txInputs = undefined
    tx.hash = tx.getHash()
    tx.txOutputs[0].tx = tx.hash

    return tx
  }
}
