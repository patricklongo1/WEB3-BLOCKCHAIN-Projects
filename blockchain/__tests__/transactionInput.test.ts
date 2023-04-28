import { describe, test, expect, beforeAll } from '@jest/globals'
import TransactionInput from '../src/lib/transactionInput'
import Wallet from '../src/lib/wallet'

describe('TransactionInput Tests', () => {
  let alice: Wallet

  beforeAll(() => {
    alice = new Wallet()
  })

  test('Should be valid', () => {
    const txInput = new TransactionInput({
      amount: 10,
      fromAddress: alice.publicKey,
    } as TransactionInput)
    txInput.sign(alice.privateKey)

    const validation = txInput.isValid()
    expect(validation.success).toBeTruthy()
  })
})
