import Validation from '../validation'

/**
 * Mock TransactionInput Class
 */
export default class TransactionInput {
  fromAddress: string
  amount: number
  signature: string

  constructor(txInput?: TransactionInput) {
    this.fromAddress = txInput?.fromAddress || 'mockaddres'
    this.amount = txInput?.amount || 10
    this.signature = txInput?.signature || 'mocked'
  }

  sign(privateKey: string): void {
    this.signature = 'mocksignature'
  }

  getHash(): string {
    return 'mockhash'
  }

  isValid(): Validation {
    if (!this.signature) {
      return new Validation(false, 'Signature is required')
    }

    if (this.amount < 1) {
      return new Validation(false, 'Amount must be greater then 0')
    }

    return new Validation()
  }
}
