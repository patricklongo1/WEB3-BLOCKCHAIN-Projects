import { describe, test, expect, beforeAll, jest } from '@jest/globals'
import Block from '../src/lib/block'
import BlockInfo from '../src/lib/interfaces/blockInfo'
import Transaction from '../src/lib/transaction'
import TransactionType from '../src/lib/interfaces/transactionType'
import TransactionInput from '../src/lib/transactionInput'
import TransactionOutput from '../src/lib/transactionOutput'
import Wallet from '../src/lib/wallet'

jest.mock('../src/lib/transaction')
jest.mock('../src/lib/transactionInput')
jest.mock('../src/lib/TransactionOutput')

describe('Block Tests', () => {
  const exampleDifficulty = 1
  let alice: Wallet
  let feeTx: Transaction
  let genesis: Block

  beforeAll(() => {
    alice = new Wallet()

    feeTx = new Transaction({
      type: TransactionType.FEE,
      txOutputs: [
        new TransactionOutput({
          toAddress: alice.publicKey,
          amount: 10,
        } as TransactionOutput),
      ],
    } as Transaction)

    genesis = new Block(
      new Block({
        transactions: [feeTx],
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
            txInputs: [new TransactionInput()],
            txOutputs: [new TransactionOutput()],
          } as Transaction),
          feeTx,
        ],
      } as Block),
    )
    block1.mine(exampleDifficulty, alice.publicKey)
    const validation = block1.isValid(
      genesis.hash,
      genesis.index,
      exampleDifficulty,
    )
    expect(validation.success).toBeTruthy()
  })

  test('Should NOT be valid (No fee)', () => {
    const block1 = new Block(
      new Block({
        index: 1,
        previousHash: genesis.hash,
        transactions: [
          new Transaction({
            txInputs: [new TransactionInput()],
            txOutputs: [new TransactionOutput()],
          } as Transaction),
        ],
      } as Block),
    )
    block1.mine(exampleDifficulty, alice.publicKey)
    const validation = block1.isValid(
      genesis.hash,
      genesis.index,
      exampleDifficulty,
    )
    expect(validation.success).toBeFalsy()
    expect(validation.message).toEqual('No fee tx.')
  })

  test('Should NOT be valid (2 txs of type FEE)', () => {
    const block1 = new Block(
      new Block({
        index: 1,
        previousHash: genesis.hash,
        transactions: [
          new Transaction({
            type: TransactionType.FEE,
            txOutputs: [new TransactionOutput()],
          } as Transaction),

          new Transaction({
            type: TransactionType.FEE,
            txOutputs: [new TransactionOutput()],
          } as Transaction),
        ],
      } as Block),
    )
    block1.mine(exampleDifficulty, alice.publicKey)
    const validation = block1.isValid(
      genesis.hash,
      genesis.index,
      exampleDifficulty,
    )
    expect(validation.success).toBeFalsy()
    expect(validation.message).toEqual('Multiples fees transactions')
  })

  test('Should NOT be valid (invalid tx)', () => {
    const tx = new Transaction({
      timestamp: -1,
    } as Transaction)
    const block1 = new Block(
      new Block({
        index: 1,
        previousHash: genesis.hash,
        transactions: [tx, feeTx],
      } as Block),
    )
    block1.mine(exampleDifficulty, alice.publicKey)
    block1.transactions[0].txOutputs[0].toAddress = ''
    const validation = block1.isValid(
      genesis.hash,
      genesis.index,
      exampleDifficulty,
    )
    expect(validation.success).toBeFalsy()
    expect(validation.message).toEqual(
      'Invalid block due to invalid tx(s): Invalid mock transaction',
    )
  })

  test('Should add from block info', () => {
    const block1 = Block.fromBlockInfo({
      transactions: [],
      difficulty: exampleDifficulty,
      feePerTx: 1,
      index: 1,
      maxDifficulty: 62,
      previousHash: genesis.hash,
    } as BlockInfo)

    block1.transactions.push(feeTx)

    block1.mine(exampleDifficulty, alice.publicKey)
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
    expect(validation.message).toEqual('Invalid index.')
  })

  test('Should NOT be valid (timestamp < 1)', () => {
    const block1 = new Block(
      new Block({
        index: 1,
        previousHash: genesis.hash,
        transactions: [
          new Transaction({
            txInputs: [new TransactionInput()],
            txOutputs: [new TransactionOutput()],
          } as Transaction),
          feeTx,
        ],
      } as Block),
    )
    block1.timestamp = -1
    block1.hash = block1.getHash()
    block1.mine(exampleDifficulty, alice.publicKey)
    const validation = block1.isValid(
      genesis.hash,
      genesis.index,
      exampleDifficulty,
    )
    expect(validation.success).toBeFalsy()
    expect(validation.message).toEqual('Invalid timestamp.')
  })

  test('Should NOT be valid (invalid hash)', () => {
    const block1 = new Block(
      new Block({
        index: 1,
        previousHash: genesis.hash,
        transactions: [
          new Transaction({
            txInputs: [new TransactionInput()],
            txOutputs: [new TransactionOutput()],
          } as Transaction),
          feeTx,
        ],
      } as Block),
    )
    block1.mine(exampleDifficulty, alice.publicKey)
    block1.hash = ''
    const validation = block1.isValid(
      genesis.hash,
      genesis.index,
      exampleDifficulty,
    )
    expect(validation.success).toBeFalsy()
    expect(validation.message).toEqual('Hash not valid.')
  })

  test('Should NOT be valid (no mined)', () => {
    const block1 = new Block(
      new Block({
        index: 1,
        nonce: 0,
        miner: alice.publicKey,
        previousHash: genesis.hash,
        transactions: [
          new Transaction({
            type: TransactionType.REGULAR,
            txInputs: [new TransactionInput()],
            txOutputs: [new TransactionOutput()],
          } as Transaction),
          feeTx,
        ],
      } as Block),
    )
    const validation = block1.isValid(
      genesis.hash,
      genesis.index,
      exampleDifficulty,
    )
    expect(validation.success).toBeFalsy()
    expect(validation.message).toEqual('No mined.')
  })

  test('Should NOT be valid (Incorrect miner hash)', () => {
    const block1 = new Block(
      new Block({
        index: 1,
        nonce: 0,
        previousHash: genesis.hash,
        transactions: [feeTx],
      } as Block),
    )
    block1.mine(exampleDifficulty, 'incorrectMinerHash')
    const validation = block1.isValid(
      genesis.hash,
      genesis.index,
      exampleDifficulty,
    )
    expect(validation.success).toBeFalsy()
    expect(validation.message).toEqual('Invalid fee tx: Incorrect miner hash')
  })

  test('Should NOT be valid (invalid previous hash)', () => {
    const block1 = new Block(
      new Block({
        index: 1,
        previousHash: 'invalid',
        transactions: [
          new Transaction({
            txInputs: [new TransactionInput()],
            txOutputs: [new TransactionOutput()],
          } as Transaction),
          feeTx,
        ],
      } as Block),
    )
    block1.mine(exampleDifficulty, alice.publicKey)
    const validation = block1.isValid(
      genesis.hash,
      genesis.index,
      exampleDifficulty,
    )
    expect(validation.success).toBeFalsy()
    expect(validation.message).toEqual('Invalid previousHash.')
  })

  test('Should NOT be valid (invalid negative index)', () => {
    const block1 = new Block(
      new Block({
        index: -1,
        previousHash: genesis.hash,
        transactions: [
          new Transaction({
            txOutputs: [new TransactionOutput()],
            txInputs: [new TransactionInput()],
          } as Transaction),
          feeTx,
        ],
      } as Block),
    )
    block1.mine(exampleDifficulty, alice.publicKey)
    const validation = block1.isValid(
      genesis.hash,
      genesis.index,
      exampleDifficulty,
    )
    expect(validation.success).toBeFalsy()
    expect(validation.message).toEqual('Invalid index.')
  })
})
