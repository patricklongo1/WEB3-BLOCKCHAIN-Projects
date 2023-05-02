import { describe, test, expect, jest } from '@jest/globals'
import Transaction from '../src/lib/transaction'
import TransactionType from '../src/lib/interfaces/transactionType'
import TransactionInput from '../src/lib/transactionInput'
import TransactionOutput from '../src/lib/transactionOutput'

jest.mock('../src/lib/transactionInput')
jest.mock('../src/lib/transactionOutput')

describe('Transaction Tests', () => {
  test('Should be valid (REGULAR default constructor)', () => {
    const tx = new Transaction({
      txInputs: [new TransactionInput()],
      txOutputs: [new TransactionOutput()],
    } as Transaction)
    const validation = tx.isValid()
    expect(validation.success).toBeTruthy()
  })

  test('Should be valid (FEE)', () => {
    const tx = new Transaction({
      type: TransactionType.FEE,
      txOutputs: [new TransactionOutput()],
    } as Transaction)
    const validation = tx.isValid()
    expect(validation.success).toBeTruthy()
  })

  test('Should be valid', () => {
    const tx = new Transaction({
      type: TransactionType.REGULAR,
      txInputs: [new TransactionInput()],
      txOutputs: [new TransactionOutput()],
    } as Transaction)
    const validation = tx.isValid()
    expect(validation.success).toBeTruthy()
  })

  test('Should NOT be valid (constructor default)', () => {
    const tx = new Transaction()
    const validation = tx.isValid()

    expect(validation.success).toBeFalsy()
  })

  test('Should NOT be valid (txo hash !== tx hash)', () => {
    const tx = new Transaction({
      type: TransactionType.REGULAR,
      txInputs: [new TransactionInput()],
      txOutputs: [new TransactionOutput()],
    } as Transaction)
    tx.txOutputs[0].tx = '!=='

    const validation = tx.isValid()

    expect(validation.success).toBeFalsy()
    expect(validation.message).toEqual('invalid txOutput reference hash.')
  })

  test('Should NOT be valid (insufficient balance)', () => {
    const tx = new Transaction({
      type: TransactionType.REGULAR,
      txInputs: [
        new TransactionInput({
          amount: 1,
        } as TransactionInput),
      ],
      txOutputs: [
        new TransactionOutput({
          amount: 10,
        } as TransactionOutput),
      ],
    } as Transaction)
    const validation = tx.isValid()

    expect(validation.success).toBeFalsy()
    expect(validation.message).toEqual(
      'Invalid transaction: input amounts must be equals or greater than outputs amounts.',
    )
  })

  test('Should NOT be valid (invalid hash)', () => {
    const tx = new Transaction({
      txInputs: [new TransactionInput()],
      txOutputs: [new TransactionOutput()],
      type: TransactionType.REGULAR,
      timestamp: Date.now(),
      hash: 'abc',
    } as Transaction)
    const validation = tx.isValid()
    expect(validation.success).toBeFalsy()
  })

  test('Should NOT be valid (invalid txInput)', () => {
    const txInputs = [new TransactionInput()]
    txInputs[0].amount = -10
    const tx = new Transaction({
      txInputs,
      txOutputs: [new TransactionOutput()],
    } as Transaction)
    const validation = tx.isValid()
    expect(validation.success).toBeFalsy()
  })
})
