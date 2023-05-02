import { jest, describe, test, expect, beforeAll } from '@jest/globals'
import Blockchain from '../src/lib/blockchain'
import Block from '../src/lib/block'
import Transaction from '../src/lib/transaction'
import TransactionInput from '../src/lib/transactionInput'
import Wallet from '../src/lib/wallet'
import TransactionOutput from '../src/lib/transactionOutput'
import TransactionType from '../src/lib/interfaces/transactionType'

jest.mock('../src/lib/block')
jest.mock('../src/lib/transaction')
jest.mock('../src/lib/transactionInput')

describe('Blockchain Tests', () => {
  let alice: Wallet

  beforeAll(() => {
    alice = new Wallet()
  })

  test('Should has genesis block', () => {
    const blockchain = new Blockchain(alice.publicKey)
    expect(blockchain.blocks.length).toEqual(1)
  })

  test('Should be valid (only genesis)', () => {
    const blockchain = new Blockchain(alice.publicKey)
    expect(blockchain.isValid().success).toBeTruthy()
  })

  test('Should be valid (two blocks)', () => {
    const blockchain = new Blockchain(alice.publicKey)
    blockchain.addBlock(
      new Block({
        index: 1,
        previousHash: blockchain.blocks[0].hash,
        transactions: [
          new Transaction({
            txInputs: [new TransactionInput()],
            txOutputs: [new TransactionOutput()],
          } as Transaction),
        ],
      } as Block),
    )
    expect(blockchain.isValid().success).toBeTruthy()
  })

  test('Should NOT be valid (invalid block)', () => {
    const blockchain = new Blockchain(alice.publicKey)
    const tx = new Transaction({
      txInputs: [new TransactionInput()],
      txOutputs: [new TransactionOutput()],
    } as Transaction)
    blockchain.mempool.push(tx)
    blockchain.addBlock(
      new Block({
        index: 1,
        previousHash: blockchain.blocks[0].hash,
        transactions: [tx],
      } as Block),
    )
    blockchain.blocks[1].index = -1
    const validation = blockchain.isValid()

    expect(validation.success).toBeFalsy()
    expect(validation.message).toEqual('Invalid block #-1: Invalid mock block.')
  })

  test('Should add transaction', () => {
    const blockchain = new Blockchain(alice.publicKey)
    const validation = blockchain.addTransaction(
      new Transaction({
        txInputs: [new TransactionInput()],
        txOutputs: [new TransactionOutput()],
        hash: 'XPTO',
      } as Transaction),
    )

    expect(validation.success).toBeTruthy()
  })

  test('Should NOT add transaction (another tx pending in mempool)', () => {
    const blockchain = new Blockchain(alice.publicKey)

    blockchain.addTransaction(
      new Transaction({
        txInputs: [new TransactionInput()],
        txOutputs: [new TransactionOutput()],
        hash: 'XPTO',
      } as Transaction),
    )

    const validationTx2 = blockchain.addTransaction(
      new Transaction({
        txInputs: [new TransactionInput()],
        txOutputs: [new TransactionOutput()],
        hash: 'XPTO2',
      } as Transaction),
    )

    expect(validationTx2.success).toBeFalsy()
    expect(validationTx2.message).toEqual(
      'This wallet has a pending transaction.',
    )
  })

  test('Should NOT add transaction (invalid tx)', () => {
    const blockchain = new Blockchain(alice.publicKey)

    const validation = blockchain.addTransaction(
      new Transaction({
        hash: 'XPTO',
        timestamp: -1,
        txInputs: [new TransactionInput()],
        txOutputs: [
          new TransactionOutput({
            toAddress: alice.publicKey,
          } as TransactionOutput),
        ],
      } as Transaction),
    )
    expect(validation.success).toBeFalsy()
    expect(validation.message).toEqual(
      'Invalid transaction: Invalid mock transaction',
    )
  })

  test('Should NOT add transaction (duplicated in blockchain)', () => {
    const blockchain = new Blockchain(alice.publicKey)
    const tx = new Transaction({
      txInputs: [new TransactionInput()],
      hash: 'fooBar',
      txOutputs: [new TransactionOutput()],
    } as Transaction)

    blockchain.blocks.push(
      new Block({
        transactions: [tx],
      } as Block),
    )

    const validation = blockchain.addTransaction(tx)

    expect(validation.success).toBeFalsy()
    expect(validation.message).toEqual('Duplicated tx in blockchain')
  })

  test('Should NOT add transaction (duplicated in mempool)', () => {
    const blockchain = new Blockchain(alice.publicKey)
    const tx = new Transaction({
      txInputs: [new TransactionInput()],
      txOutputs: [new TransactionOutput()],
      hash: 'fooBar',
    } as Transaction)

    blockchain.mempool.push(tx)

    const validation = blockchain.addTransaction(tx)

    expect(validation.success).toBeFalsy()
    expect(validation.message).toEqual('This wallet has a pending transaction.')
  })

  test('Should get block', () => {
    const blockchain = new Blockchain(alice.publicKey)
    const block = blockchain.getBlockByHash(blockchain.blocks[0].hash)
    expect(block).toBeTruthy()
  })

  test('Should get transaction (mempool)', () => {
    const blockchain = new Blockchain(alice.publicKey)
    const tx = new Transaction({
      txInputs: [new TransactionInput()],
      hash: 'XPTO',
      txOutputs: [new TransactionOutput()],
    } as Transaction)

    blockchain.blocks.push(new Block({ transactions: [tx] } as Block))
    const result = blockchain.getTransaction('XPTO')
    expect(result.blockIndex).toEqual(1) // is the Genesis Block
  })

  test('Should get transaction (blockchain)', () => {
    const blockchain = new Blockchain(alice.publicKey)
    const tx = new Transaction({
      txInputs: [new TransactionInput()],
      hash: 'XPTO',
      txOutputs: [new TransactionOutput()],
    } as Transaction)

    blockchain.mempool.push(tx)
    const result = blockchain.getTransaction('XPTO')
    expect(result.mempoolIndex).toEqual(0)
  })

  test('Should NOT get transaction', () => {
    const blockchain = new Blockchain(alice.publicKey)
    const result = blockchain.getTransaction('hashthatnotexists')
    expect(result.transaction).toBeUndefined()
  })

  test('Should add a new block', () => {
    const blockchain = new Blockchain(alice.publicKey)
    const tx = new Transaction({
      txOutputs: [new TransactionOutput()],
      txInputs: [new TransactionInput()],
    } as Transaction)

    blockchain.mempool.push(tx)
    const result = blockchain.addBlock(
      new Block(
        new Block({
          index: 1,
          previousHash: blockchain.blocks[0].hash,
          transactions: [tx],
        } as Block),
      ),
    )
    expect(result.success).toBeTruthy()
  })

  test('Should NOT add a new block (empty mempool)', () => {
    const blockchain = new Blockchain(alice.publicKey)
    const validation = blockchain.addBlock(
      new Block({
        index: 1,
        previousHash: blockchain.blocks[0].hash,
        transactions: [
          new Transaction({
            type: TransactionType.FEE,
            txOutputs: [
              new TransactionOutput({
                toAddress: alice.publicKey,
                amount: 10,
              } as TransactionOutput),
            ],
          } as Transaction),
        ],
      } as Block),
    )

    expect(validation.success).toBeFalsy()
    expect(validation.message).toEqual(
      'There is no transactions to add a new block',
    )
  })

  test('Should NOT add a new block (block is not in mempool)', () => {
    const blockchain = new Blockchain(alice.publicKey)
    blockchain.mempool.push(new Transaction())
    blockchain.mempool.push(new Transaction())
    const tx = new Transaction()

    const validation = blockchain.addBlock(
      new Block({
        index: 1,
        previousHash: blockchain.blocks[0].hash,
        transactions: [tx],
      } as Block),
    )

    expect(validation.success).toBeFalsy()
    expect(validation.message).toEqual('Invalid tx in block: mempool')
  })

  test('Should NOT add a new block (negative index)', () => {
    const blockchain = new Blockchain(alice.publicKey)
    blockchain.mempool.push(new Transaction())
    const validation = blockchain.addBlock(
      new Block({
        index: -1,
        previousHash: blockchain.blocks[0].hash,
        transactions: [
          new Transaction({
            type: TransactionType.FEE,
            txOutputs: [
              new TransactionOutput({
                toAddress: alice.publicKey,
                amount: 10,
              } as TransactionOutput),
            ],
          } as Transaction),
        ],
      } as Block),
    )

    expect(validation.success).toBeFalsy()
    expect(validation.message).toEqual('Invalid block: Invalid mock block.')
  })

  test('Should get next block info', () => {
    const blockchain = new Blockchain(alice.publicKey)
    blockchain.mempool.push(
      new Transaction({ txOutputs: [new TransactionOutput()] } as Transaction),
    )
    const nextBlockInfo = blockchain.getNextBlock()

    expect(nextBlockInfo ? nextBlockInfo.index : 0).toEqual(1)
  })

  test('Should NOT get next block info', () => {
    const blockchain = new Blockchain(alice.publicKey)
    const nextBlockInfo = blockchain.getNextBlock()

    expect(nextBlockInfo).toBeNull()
  })
})
