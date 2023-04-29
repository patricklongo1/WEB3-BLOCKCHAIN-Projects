import { describe, test, expect, beforeAll } from '@jest/globals'
import TransactionInput from '../src/lib/transactionInput'
import Wallet from '../src/lib/wallet'

describe('TransactionInput Tests', () => {
  let alice: Wallet
  let bob: Wallet

  beforeAll(() => {
    alice = new Wallet()
    bob = new Wallet()
  })

  test('Should be valid (with own params)', () => {
    const txInput = new TransactionInput({
      amount: 10,
      fromAddress: alice.publicKey,
    } as TransactionInput)
    txInput.sign(alice.privateKey)

    const validation = txInput.isValid()
    expect(validation.success).toBeTruthy()
  })

  test('Should NOT be valid (with constructor default)', () => {
    const txInput = new TransactionInput()
    txInput.sign(alice.privateKey)

    const validation = txInput.isValid()
    expect(validation.success).toBeFalsy()
  })

  test('Should NOT be valid (without signature)', () => {
    const txInput = new TransactionInput({
      amount: 10,
      fromAddress: alice.publicKey,
    } as TransactionInput)

    const validation = txInput.isValid()
    expect(validation.success).toBeFalsy()
  })

  test('Should NOT be valid (negative amount)', () => {
    const txInput = new TransactionInput({
      amount: -10,
      fromAddress: alice.publicKey,
    } as TransactionInput)
    txInput.sign(alice.privateKey)

    const validation = txInput.isValid()
    expect(validation.success).toBeFalsy()
  })

  test('Should NOT be valid (invalid signature)', () => {
    const txInput = new TransactionInput({
      amount: 10,
      fromAddress: alice.publicKey,
    } as TransactionInput)
    txInput.sign(bob.privateKey)

    const validation = txInput.isValid()
    expect(validation.success).toBeFalsy()
  })
})
