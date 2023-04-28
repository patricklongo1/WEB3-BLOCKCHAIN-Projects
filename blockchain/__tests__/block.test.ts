import { describe, test, expect, beforeAll, jest } from '@jest/globals'
import Block from '../src/lib/block'
import BlockInfo from '../src/lib/interfaces/blockInfo'
import Transaction from '../src/lib/transaction'
import TransactionType from '../src/lib/interfaces/transactionType'

jest.mock('../src/lib/transaction')

describe('Block Tests', () => {
  const exampleDifficulty = 0
  const exampleMiner = 'minerwallethash'
  let genesis: Block

  beforeAll(() => {
    genesis = new Block(
      new Block({
        transactions: [
          new Transaction({
            type: TransactionType.FEE,
            data: new Date().toString(),
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
            data: new Date().toString(),
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
            data: 'fee 1',
          } as Transaction),

          new Transaction({
            type: TransactionType.FEE,
            data: 'fee 2',
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
            data: 'fee 1',
          } as Transaction),

          new Transaction({
            type: TransactionType.FEE,
            data: 'fee 2',
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
    const block1 = new Block(
      new Block({
        index: 1,
        previousHash: genesis.hash,
        transactions: [new Transaction()],
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

  test('Should add from block info', () => {
    const block1 = Block.fromBlockInfo({
      transactions: [
        new Transaction({
          type: TransactionType.FEE,
          data: new Date().toString(),
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
            data: new Date().toString(),
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
            data: new Date().toString(),
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
            data: new Date().toString(),
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
            data: new Date().toString(),
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

  test('Should NOT be valid (invalid empty data)', () => {
    const block1 = new Block(
      new Block({
        index: 1,
        previousHash: genesis.hash,
        transactions: [
          new Transaction({
            data: '',
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
            data: new Date().toString(),
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
