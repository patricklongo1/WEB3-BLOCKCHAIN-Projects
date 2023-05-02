import Validation from '../validation'

/**
 * Mock TransactionInput Class
 */
export default class TransactionInput {
  fromAddress: string
  amount: number
  previousTx: string
  signature: string

  constructor(txInput?: TransactionInput) {
    this.fromAddress = txInput?.fromAddress || 'mockaddres'
    this.amount = txInput?.amount || 10
    this.previousTx = txInput?.previousTx || 'mockeprevioustx'
    this.signature = txInput?.signature || 'mocked'
  }

  sign(privateKey: string): void {
    this.signature = 'mocksignature'
  }

  getHash(): string {
    return 'mockhash'
  }

  isValid(): Validation {
    if (!this.signature || !this.previousTx) {
      return new Validation(
        false,
        'Signature and Previous transaction are required',
      )
    }

    if (this.amount < 1) {
      return new Validation(false, 'Amount must be greater then 0')
    }

    return new Validation()
  }
}
