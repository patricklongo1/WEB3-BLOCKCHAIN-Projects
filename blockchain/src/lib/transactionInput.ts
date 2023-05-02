import * as ecc from 'tiny-secp256k1'
import ECPairFactory from 'ecpair'
import CryptoJS from 'crypto-js'
import Validation from './validation'

const ECPair = ECPairFactory(ecc)
/**
 * TransactionInput Class
 */
export default class TransactionInput {
  fromAddress: string
  amount: number
  previousTx: string
  signature: string

  constructor(txInput?: TransactionInput) {
    this.fromAddress = txInput?.fromAddress || ''
    this.amount = txInput?.amount || 0
    this.previousTx = txInput?.previousTx || ''
    this.signature = txInput?.signature || ''
  }

  sign(privateKey: string): void {
    this.signature = ECPair.fromPrivateKey(Buffer.from(privateKey, 'hex'))
      .sign(Buffer.from(this.getHash(), 'hex'))
      .toString('hex')
  }

  getHash(): string {
    return CryptoJS.SHA256(
      `${this.fromAddress}${this.amount}${this.previousTx}`,
    ).toString()
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

    const hash = Buffer.from(this.getHash(), 'hex')
    const isValid = ECPair.fromPublicKey(
      Buffer.from(this.fromAddress, 'hex'),
    ).verify(hash, Buffer.from(this.signature, 'hex'))

    return isValid
      ? new Validation()
      : new Validation(false, 'Invalid tx input signature')
  }
}
