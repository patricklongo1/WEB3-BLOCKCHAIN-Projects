import { describe, test, expect, beforeAll } from '@jest/globals'
import Block from '../src/lib/block'

describe('Block Tests', () => {
  let genesis: Block

  beforeAll(() => {
    genesis = new Block(
      new Block({
        data: 'Genesis block',
      } as Block),
    )
  })

  test('Should be valid', () => {
    const block1 = new Block(
      new Block({
        index: 1,
        previousHash: genesis.hash,
        data: 'Data of block',
      } as Block),
    )
    const validation = block1.isValid(genesis.hash, genesis.index)
    expect(validation.success).toBeTruthy()
  })

  test('Should NOT be valid (default params value)', () => {
    const block1 = new Block(new Block())
    const validation = block1.isValid(genesis.hash, genesis.index)
    expect(validation.success).toBeFalsy()
  })

  test('Should NOT be valid (timestamp < 1)', () => {
    const block1 = new Block(
      new Block({
        index: 1,
        previousHash: genesis.hash,
        data: 'Data of block',
      } as Block),
    )
    block1.timestamp = -1
    block1.hash = block1.getHash()
    const validation = block1.isValid(genesis.hash, genesis.index)
    expect(validation.success).toBeFalsy()
  })

  test('Should NOT be valid (invalid empty hash)', () => {
    const block1 = new Block(
      new Block({
        index: 1,
        previousHash: genesis.hash,
        data: 'Data of block',
      } as Block),
    )
    block1.hash = ''
    const validation = block1.isValid(genesis.hash, genesis.index)
    expect(validation.success).toBeFalsy()
  })

  test('Should NOT be valid (invalid previous hash)', () => {
    const block1 = new Block(
      new Block({
        index: 1,
        previousHash: 'invalid',
        data: 'Data of block',
      } as Block),
    )
    const validation = block1.isValid(genesis.hash, genesis.index)
    expect(validation.success).toBeFalsy()
  })

  test('Should NOT be valid (invalid empty data)', () => {
    const block1 = new Block(
      new Block({
        index: 1,
        previousHash: genesis.hash,
        data: '',
      } as Block),
    )
    const validation = block1.isValid(genesis.hash, genesis.index)
    expect(validation.success).toBeFalsy()
  })

  test('Should NOT be valid (invalid negative index)', () => {
    const block1 = new Block(
      new Block({
        index: -1,
        previousHash: genesis.hash,
        data: 'Data of block',
      } as Block),
    )
    const validation = block1.isValid(genesis.hash, genesis.index)
    expect(validation.success).toBeFalsy()
  })
})
