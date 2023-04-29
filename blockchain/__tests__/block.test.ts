import { describe, test, expect, beforeAll, jest } from '@jest/globals'
import Block from '../src/lib/block'
import BlockInfo from '../src/lib/interfaces/blockInfo'
import Transaction from '../src/lib/transaction'
import TransactionType from '../src/lib/interfaces/transactionType'
import TransactionInput from '../src/lib/transactionInput'

jest.mock('../src/lib/transaction')
jest.mock('../src/lib/transactionInput')

describe('Block Tests', () => {
  const exampleDifficulty = 0
  const exampleMiner = 'minerwallethash'
  let genesis: Block

  beforeAll(() => {
    genesis = new Block(
      new Block({
        transactions: [
          new Transaction({
            to: 'toWallet',
            type: TransactionType.FEE,
            txInput: new TransactionInput(),
          } as Transaction),
        ],
      } as Block),
    )
  })

  test('Should be valid', () => {
    const block1 = new Block(
      new Block({
        index: 1,
        previousHash: genesis.hash,
        transactions: [
          new Transaction({
            txInput: new TransactionInput(),
            to: 'toWallet',
          } as Transaction),
        ],
      } as Block),
    )
    block1.mine(exampleDifficulty, exampleMiner)
    const validation = block1.isValid(
      genesis.hash,
      genesis.index,
      exampleDifficulty,
    )
    expect(validation.success).toBeTruthy()
  })

  test('Should NOT be valid (Too many txs of type FEE)', () => {
    const block1 = new Block(
      new Block({
        index: 1,
        previousHash: genesis.hash,
        transactions: [
          new Transaction({
            type: TransactionType.FEE,
            txInput: new TransactionInput(),
            to: 'toWallet',
          } as Transaction),

          new Transaction({
            type: TransactionType.FEE,
            txInput: new TransactionInput(),
            to: 'toWallet',
          } as Transaction),
        ],
      } as Block),
    )
    block1.mine(exampleDifficulty, exampleMiner)
    const validation = block1.isValid(
      genesis.hash,
      genesis.index,
      exampleDifficulty,
    )
    expect(validation.success).toBeFalsy()
  })

  test('Should NOT be valid (2 txs of type FEE)', () => {
    const block1 = new Block(
      new Block({
        index: 1,
        previousHash: genesis.hash,
        transactions: [
          new Transaction({
            type: TransactionType.FEE,
            txInput: new TransactionInput(),
            to: 'toWallet',
          } as Transaction),

          new Transaction({
            type: TransactionType.FEE,
            txInput: new TransactionInput(),
            to: 'toWallet',
          } as Transaction),
        ],
      } as Block),
    )
    block1.mine(exampleDifficulty, exampleMiner)
    const validation = block1.isValid(
      genesis.hash,
      genesis.index,
      exampleDifficulty,
    )
    expect(validation.success).toBeFalsy()
  })

  test('Should NOT be valid (invalid tx)', () => {
    const tx = new Transaction()
    const block1 = new Block(
      new Block({
        index: 1,
        previousHash: genesis.hash,
        transactions: [tx],
      } as Block),
    )
    block1.mine(exampleDifficulty, exampleMiner)
    block1.transactions[0].to = ''
    const validation = block1.isValid(
      genesis.hash,
      genesis.index,
      exampleDifficulty,
    )
    expect(validation.success).toBeFalsy()
  })

  test('Should add from block info', () => {
    const block1 = Block.fromBlockInfo({
      transactions: [
        new Transaction({
          type: TransactionType.FEE,
          to: 'toWallet',
          txInput: new TransactionInput(),
        } as Transaction),
      ],
      difficulty: exampleDifficulty,
      feePerTx: 1,
      index: 1,
      maxDifficulty: 62,
      previousHash: genesis.hash,
    } as BlockInfo)
    block1.mine(exampleDifficulty, exampleMiner)
    const validation = block1.isValid(
      genesis.hash,
      genesis.index,
      exampleDifficulty,
    )
    expect(validation.success).toBeTruthy()
  })

  test('Should NOT be valid (default params value)', () => {
    const block1 = new Block(new Block())
    const validation = block1.isValid(
      genesis.hash,
      genesis.index,
      exampleDifficulty,
    )
    expect(validation.success).toBeFalsy()
  })

  test('Should NOT be valid (timestamp < 1)', () => {
    const block1 = new Block(
      new Block({
        index: 1,
        previousHash: genesis.hash,
        transactions: [
          new Transaction({
            txInput: new TransactionInput(),
            to: 'toWallet',
          } as Transaction),
        ],
      } as Block),
    )
    block1.timestamp = -1
    block1.hash = block1.getHash()
    const validation = block1.isValid(
      genesis.hash,
      genesis.index,
      exampleDifficulty,
    )
    expect(validation.success).toBeFalsy()
  })

  test('Should NOT be valid (invalid hash)', () => {
    const block1 = new Block(
      new Block({
        index: 1,
        previousHash: genesis.hash,
        transactions: [
          new Transaction({
            txInput: new TransactionInput(),
            to: 'toWallet',
          } as Transaction),
        ],
      } as Block),
    )
    block1.mine(exampleDifficulty, exampleMiner)
    block1.hash = ''
    const validation = block1.isValid(
      genesis.hash,
      genesis.index,
      exampleDifficulty,
    )
    expect(validation.success).toBeFalsy()
  })

  test('Should NOT be valid (no mined)', () => {
    const block1 = new Block(
      new Block({
        index: 1,
        previousHash: genesis.hash,
        transactions: [
          new Transaction({
            txInput: new TransactionInput(),
            to: 'toWallet',
          } as Transaction),
        ],
      } as Block),
    )
    const validation = block1.isValid(
      genesis.hash,
      genesis.index,
      exampleDifficulty,
    )
    expect(validation.success).toBeFalsy()
  })

  test('Should NOT be valid (invalid previous hash)', () => {
    const block1 = new Block(
      new Block({
        index: 1,
        previousHash: 'invalid',
        transactions: [
          new Transaction({
            txInput: new TransactionInput(),
            to: 'toWallet',
          } as Transaction),
        ],
      } as Block),
    )
    const validation = block1.isValid(
      genesis.hash,
      genesis.index,
      exampleDifficulty,
    )
    expect(validation.success).toBeFalsy()
  })

  test('Should NOT be valid (invalid txInput)', () => {
    const txInput = new TransactionInput()
    txInput.amount = -1

    const block1 = new Block(
      new Block({
        index: 1,
        previousHash: genesis.hash,
        transactions: [
          new Transaction({
            to: 'toWallet',
            txInput,
          } as Transaction),
        ],
      } as Block),
    )
    const validation = block1.isValid(
      genesis.hash,
      genesis.index,
      exampleDifficulty,
    )
    expect(validation.success).toBeFalsy()
  })

  test('Should NOT be valid (invalid negative index)', () => {
    const block1 = new Block(
      new Block({
        index: -1,
        previousHash: genesis.hash,
        transactions: [
          new Transaction({
            to: 'toWallet',
            txInput: new TransactionInput(),
          } as Transaction),
        ],
      } as Block),
    )
    const validation = block1.isValid(
      genesis.hash,
      genesis.index,
      exampleDifficulty,
    )
    expect(validation.success).toBeFalsy()
  })
})
