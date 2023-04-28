import { describe, test, expect } from '@jest/globals'
import Transaction from '../src/lib/transaction'
import TransactionType from '../src/lib/interfaces/transactionType'

describe('Transaction Tests', () => {
  test('Should be valid (REGULAR default constructor)', () => {
    const tx = new Transaction({
      data: new Date().toString(),
    } as Transaction)
    const validation = tx.isValid()
    expect(validation.success).toBeTruthy()
  })

  test('Should be valid (FEE)', () => {
    const tx = new Transaction({
      type: TransactionType.FEE,
      data: new Date().toString(),
    } as Transaction)
    const validation = tx.isValid()
    expect(validation.success).toBeTruthy()
  })

  test('Should NOT be valid (invalid hash)', () => {
    const tx = new Transaction({
      data: new Date().toString(),
      type: TransactionType.REGULAR,
      timestamp: Date.now(),
      hash: 'abc',
    } as Transaction)
    const validation = tx.isValid()
    expect(validation.success).toBeFalsy()
  })

  test('Should NOT be valid (empty data)', () => {
    const tx = new Transaction()
    const validation = tx.isValid()
    expect(validation.success).toBeFalsy()
  })
})
