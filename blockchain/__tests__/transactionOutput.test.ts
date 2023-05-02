import { describe, test, expect, beforeAll } from '@jest/globals'
import TransactionOutput from '../src/lib/transactionOutput'
import Wallet from '../src/lib/wallet'

describe('TransactionOutput Tests', () => {
  let alice: Wallet
  let bob: Wallet

  beforeAll(() => {
    alice = new Wallet()
    bob = new Wallet()
  })

  test('Should get hash', () => {
    const txOutput = new TransactionOutput({
      amount: 10,
      toAddress: alice.publicKey,
      tx: 'txfromtest',
    } as TransactionOutput)

    const hash = txOutput.getHash()
    expect(hash).toBeTruthy()
  })

  test('Should be valid', () => {
    const txOutput = new TransactionOutput({
      amount: 10,
      toAddress: alice.publicKey,
      tx: 'txfromtest',
    } as TransactionOutput)

    const validation = txOutput.isValid()
    expect(validation.success).toBeTruthy()
  })

  test('Should NOT be valid (Constructor default)', () => {
    const txOutput = new TransactionOutput()

    const validation = txOutput.isValid()

    expect(validation.success).toBeFalsy()
    expect(validation.message).toEqual('Invalid amount')
  })

  test('Should NOT be valid', () => {
    const txOutput = new TransactionOutput({
      amount: -1,
      toAddress: alice.publicKey,
      tx: 'txfromtest',
    } as TransactionOutput)

    const validation = txOutput.isValid()

    expect(validation.success).toBeFalsy()
    expect(validation.message).toEqual('Invalid amount')
  })
})
