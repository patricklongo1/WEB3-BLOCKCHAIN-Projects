import { jest, describe, test, expect } from '@jest/globals'
import Blockchain from '../src/lib/blockchain'
import Block from '../src/lib/block'
import Transaction from '../src/lib/transaction'
import TransactionInput from '../src/lib/transactionInput'

jest.mock('../src/lib/block')
jest.mock('../src/lib/transaction')
jest.mock('../src/lib/transactionInput')

describe('Blockchain Tests', () => {
  test('Should has genesis block', () => {
    const blockchain = new Blockchain()
    expect(blockchain.blocks.length).toEqual(1)
  })

  test('Should be valid (only genesis)', () => {
    const blockchain = new Blockchain()
    expect(blockchain.isValid().success).toBeTruthy()
  })

  test('Should be valid (two blocks)', () => {
    const blockchain = new Blockchain()
    blockchain.addBlock(
      new Block({
        index: 1,
        previousHash: blockchain.blocks[0].hash,
        transactions: [
          new Transaction({
            txInput: new TransactionInput(),
            to: 'toWallet',
          } as Transaction),
        ],
      } as Block),
    )
    expect(blockchain.isValid().success).toBeTruthy()
  })

  test('Should NOT be valid (invalid block)', () => {
    const blockchain = new Blockchain()
    const tx = new Transaction({
      txInput: new TransactionInput(),
      to: 'toWallet',
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
    expect(blockchain.isValid().success).toBeFalsy()
  })

  test('Should add transaction', () => {
    const blockchain = new Blockchain()
    const validation = blockchain.addTransaction(
      new Transaction({
        txInput: new TransactionInput(),
        to: 'toWallet',
        hash: 'XPTO',
      } as Transaction),
    )

    expect(validation.success).toBeTruthy()
  })

  test('Should NOT add transaction (invalid txInput)', () => {
    const blockchain = new Blockchain()

    const txInput = new TransactionInput()
    txInput.amount = -10
    const validation = blockchain.addTransaction(
      new Transaction({
        txInput,
        hash: 'XPTO',
        to: 'toWallet',
      } as Transaction),
    )

    expect(validation.success).toBeFalsy()
  })

  test('Should NOT add transaction (duplicated in blockchain)', () => {
    const blockchain = new Blockchain()
    const tx = new Transaction({
      txInput: new TransactionInput(),
      hash: 'fooBar',
      to: 'toWallet',
    } as Transaction)

    blockchain.blocks.push(
      new Block({
        transactions: [tx],
      } as Block),
    )

    const validation = blockchain.addTransaction(tx)
    expect(validation.success).toBeFalsy()
  })

  test('Should NOT add transaction (duplicated in mempool)', () => {
    const blockchain = new Blockchain()
    const tx = new Transaction({
      txInput: new TransactionInput(),
      to: 'toWallet',
      hash: 'fooBar',
    } as Transaction)

    blockchain.mempool.push(tx)

    const validation = blockchain.addTransaction(tx)
    expect(validation.success).toBeFalsy()
  })

  test('Should get block', () => {
    const blockchain = new Blockchain()
    const block = blockchain.getBlockByHash(blockchain.blocks[0].hash)
    expect(block).toBeTruthy()
  })

  test('Should get transaction (mempool)', () => {
    const blockchain = new Blockchain()
    const tx = new Transaction({
      txInput: new TransactionInput(),
      hash: 'XPTO',
      to: 'toWallet',
    } as Transaction)

    blockchain.blocks.push(new Block({ transactions: [tx] } as Block))
    const result = blockchain.getTransaction('XPTO')
    expect(result.blockIndex).toEqual(1) // is the Genesis Block
  })

  test('Should get transaction (blockchain)', () => {
    const blockchain = new Blockchain()
    const tx = new Transaction({
      txInput: new TransactionInput(),
      hash: 'XPTO',
      to: 'toWallet',
    } as Transaction)

    blockchain.mempool.push(tx)
    const result = blockchain.getTransaction('XPTO')
    expect(result.mempoolIndex).toEqual(0)
  })

  test('Should NOT get transaction', () => {
    const blockchain = new Blockchain()
    const result = blockchain.getTransaction('hashthatnotexists')
    expect(result.transaction).toBeUndefined()
  })

  test('Should add a new block', () => {
    const blockchain = new Blockchain()
    const tx = new Transaction({
      to: 'toWallet',
      txInput: new TransactionInput(),
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

  test('Should NOT add a new block', () => {
    const blockchain = new Blockchain()
    const result = blockchain.addBlock(
      new Block({
        index: -1,
        previousHash: blockchain.blocks[0].hash,
        transactions: [
          new Transaction({
            to: 'toWallet',
            txInput: new TransactionInput(),
          } as Transaction),
        ],
      } as Block),
    )
    expect(result.success).toBeFalsy()
  })

  test('Should get next block info', () => {
    const blockchain = new Blockchain()
    blockchain.mempool.push(new Transaction({ to: 'toWallet' } as Transaction))
    const nextBlockInfo = blockchain.getNextBlock()

    expect(nextBlockInfo ? nextBlockInfo.index : 0).toEqual(1)
  })

  test('Should NOT get next block info', () => {
    const blockchain = new Blockchain()
    const nextBlockInfo = blockchain.getNextBlock()

    expect(nextBlockInfo).toBeNull()
  })
})
