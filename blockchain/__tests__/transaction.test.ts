import { describe, test, expect, jest } from '@jest/globals'
import Transaction from '../src/lib/transaction'
import TransactionType from '../src/lib/interfaces/transactionType'
import TransactionInput from '../src/lib/transactionInput'

jest.mock('../src/lib/transactionInput')

describe('Transaction Tests', () => {
  test('Should be valid (REGULAR default constructor)', () => {
    const tx = new Transaction({
      txInput: new TransactionInput(),
      to: 'toWallet',
    } as Transaction)
    const validation = tx.isValid()
    expect(validation.success).toBeTruthy()
  })

  test('Should be valid (FEE)', () => {
    const tx = new Transaction({
      type: TransactionType.FEE,
      to: 'toWallet',
    } as Transaction)
    const validation = tx.isValid()
    expect(validation.success).toBeTruthy()
  })

  test('Should be valid (full)', () => {
    const tx = new Transaction({
      type: TransactionType.REGULAR,
      txInput: new TransactionInput(),
      to: 'toWallet',
    } as Transaction)
    const validation = tx.isValid()
    expect(validation.success).toBeTruthy()
  })

  test('Should NOT be valid (invalid hash)', () => {
    const tx = new Transaction({
      txInput: new TransactionInput(),
      to: 'toWallet',
      type: TransactionType.REGULAR,
      timestamp: Date.now(),
      hash: 'abc',
    } as Transaction)
    const validation = tx.isValid()
    expect(validation.success).toBeFalsy()
  })

  test('Should NOT be valid (invalid to)', () => {
    const tx = new Transaction()
    tx.to = ''
    const validation = tx.isValid()
    expect(validation.success).toBeFalsy()
  })

  test('Should NOT be valid (invalid txInput)', () => {
    const txInput = new TransactionInput()
    txInput.amount = -10
    const tx = new Transaction({ txInput, to: 'toWallet' } as Transaction)
    const validation = tx.isValid()
    expect(validation.success).toBeFalsy()
  })
})
