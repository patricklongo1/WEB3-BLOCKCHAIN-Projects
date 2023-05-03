import CryptoJS from 'crypto-js'
import TransactionType from './interfaces/transactionType'
import Validation from './validation'
import TransactionInput from './transactionInput'
import TransactionOutput from './transactionOutput'
import Blockchain from './blockchain'

/**
 * Transaction Class
 */
export default class Transaction {
  type: TransactionType
  timestamp: number
  txInputs: TransactionInput[] | undefined
  txOutputs: TransactionOutput[]
  hash: string

  /**
   * Transaction constructor
   * @param tx Transaction data
   */
  constructor(tx?: Transaction) {
    this.type = tx?.type || TransactionType.REGULAR
    this.timestamp = tx?.timestamp || Date.now()
    this.txInputs = tx?.txInputs
      ? tx.txInputs.map((txI) => new TransactionInput(txI))
      : undefined
    this.txOutputs = tx?.txOutputs
      ? tx.txOutputs.map((txO) => new TransactionOutput(txO))
      : []
    this.hash = tx?.hash || this.getHash()

    this.txOutputs.forEach((txO) => (txO.tx = this.hash))
  }

  getHash(): string {
    const from =
      this.txInputs && this.txInputs.length
        ? this.txInputs.map((txI) => txI.signature).join(',')
        : ''

    const to =
      this.txOutputs && this.txOutputs.length
        ? this.txOutputs.map((txO) => txO.getHash()).join(',')
        : ''
    return CryptoJS.SHA256(
      `${this.type}${this.timestamp}${from}${to}`,
    ).toString()
  }

  getFee(): number {
    let inputSum: number = 0
    let outputSum: number = 0

    if (this.txInputs && this.txInputs.length) {
      inputSum = this.txInputs
        .map((txI) => txI.amount)
        .reduce((sum, txiAmount) => sum + txiAmount)

      if (this.txOutputs && this.txOutputs.length) {
        outputSum = this.txOutputs
          .map((txO) => txO.amount)
          .reduce((sum, txoAmount) => sum + txoAmount)
      }

      return inputSum - outputSum
    }

    return 0
  }

  isValid(difficulty: number, totalFees: number): Validation {
    if (this.hash !== this.getHash()) {
      return new Validation(false, 'Invalid hash.')
    }

    if (
      !this.txOutputs ||
      !this.txOutputs.length ||
      this.txOutputs.map((txo) => txo.isValid()).some((v) => !v.success)
    )
      return new Validation(false, 'Invalid TXO.')

    if (this.txInputs && this.txInputs.length) {
      const validations = this.txInputs
        .map((txI) => txI.isValid())
        .filter((v) => !v.success)
      if (validations && validations.length) {
        const message = validations.map((v) => v.message).join(', ')
        return new Validation(false, `Invalid transaction input: ${message}`)
      }
    }

    const inputSum = this.txInputs
      ?.map((txI) => txI.amount)
      .reduce((a, b) => a + b, 0)
    const outputSum = this.txOutputs
      ?.map((txO) => txO.amount)
      .reduce((a, b) => a + b, 0)

    if (inputSum && inputSum < outputSum) {
      return new Validation(
        false,
        'Invalid transaction: input amounts must be equals or greater than outputs amounts.',
      )
    }

    if (this.txOutputs.some((txO) => txO.tx !== this.hash)) {
      return new Validation(false, `invalid txOutput reference hash.`)
    }

    if (this.type === TransactionType.FEE) {
      const txO = this.txOutputs[0]
      if (txO.amount > Blockchain.getRewardAmount(difficulty) + totalFees) {
        return new Validation(false, `Invalid transaction reward.`)
      }
    }

    return new Validation()
  }

  static fromReward(txO: TransactionOutput): Transaction {
    const tx = new Transaction({
      type: TransactionType.FEE,
      txOutputs: [txO],
    } as Transaction)

    tx.hash = tx.getHash()
    tx.txOutputs[0].tx = tx.hash

    return tx
  }
}
