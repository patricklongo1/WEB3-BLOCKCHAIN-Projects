import { jest, describe, test, expect } from '@jest/globals'
import Blockchain from '../src/lib/blockchain'
import Block from '../src/lib/block'
import Transaction from '../src/lib/transaction'

jest.mock('../src/lib/block')
jest.mock('../src/lib/transaction')

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
            data: new Date().toString(),
          } as Transaction),
        ],
      } as Block),
    )
    expect(blockchain.isValid().success).toBeTruthy()
  })

  test('Should NOT be valid (invalid block)', () => {
    const blockchain = new Blockchain()
    const tx = new Transaction({
      data: new Date().toString(),
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
        data: new Date().toString(),
        hash: 'XPTO',
      } as Transaction),
    )

    expect(validation.success).toBeTruthy()
  })

  test('Should NOT add transaction (empty data)', () => {
    const blockchain = new Blockchain()
    const validation = blockchain.addTransaction(
      new Transaction({
        data: '',
        hash: 'XPTO',
      } as Transaction),
    )

    expect(validation.success).toBeFalsy()
  })

  test('Should NOT add transaction (duplicated in blockchain)', () => {
    const blockchain = new Blockchain()
    const tx = new Transaction({
      data: 'XPTO',
      hash: 'fooBar',
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
      data: 'XPTO',
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
      data: new Date().toString(),
      hash: 'XPTO',
    } as Transaction)

    blockchain.blocks.push(new Block({ transactions: [tx] } as Block))
    const result = blockchain.getTransaction('XPTO')
    expect(result.blockIndex).toEqual(1) // is the Genesis Block
  })

  test('Should get transaction (blockchain)', () => {
    const blockchain = new Blockchain()
    const tx = new Transaction({
      data: new Date().toString(),
      hash: 'XPTO',
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
      data: new Date().toString(),
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
            data: new Date().toString(),
          } as Transaction),
        ],
      } as Block),
    )
    expect(result.success).toBeFalsy()
  })

  test('Should get next block info', () => {
    const blockchain = new Blockchain()
    blockchain.mempool.push(new Transaction())
    const nextBlockInfo = blockchain.getNextBlock()

    expect(nextBlockInfo ? nextBlockInfo.index : 0).toEqual(1)
  })

  test('Should NOT get next block info', () => {
    const blockchain = new Blockchain()
    const nextBlockInfo = blockchain.getNextBlock()

    expect(nextBlockInfo).toBeNull()
  })
})
