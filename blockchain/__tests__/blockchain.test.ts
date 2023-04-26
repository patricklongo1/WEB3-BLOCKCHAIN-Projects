import { jest, describe, test, expect } from '@jest/globals'
import Blockchain from '../src/lib/blockchain'
import Block from '../src/lib/block'

jest.mock('../src/lib/block')

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
        data: 'Data',
      } as Block),
    )
    expect(blockchain.isValid().success).toBeTruthy()
  })

  test('Should NOT be valid (two blocks)', () => {
    const blockchain = new Blockchain()
    blockchain.addBlock(
      new Block({
        index: 1,
        previousHash: blockchain.blocks[0].hash,
        data: 'Data',
      } as Block),
    )
    blockchain.blocks[1].index = -1
    expect(blockchain.isValid().success).toBeFalsy()
  })

  test('Should get block', () => {
    const blockchain = new Blockchain()
    const block = blockchain.getBlockByHash(blockchain.blocks[0].hash)
    expect(block).toBeTruthy()
  })

  test('Should add a new block', () => {
    const blockchain = new Blockchain()
    const result = blockchain.addBlock(
      new Block(
        new Block({
          index: 1,
          previousHash: blockchain.blocks[0].hash,
          data: 'Data',
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
        data: 'Data',
      } as Block),
    )
    expect(result.success).toBeFalsy()
  })
})
