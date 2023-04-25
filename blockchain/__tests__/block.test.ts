import { describe, test, expect, beforeAll } from '@jest/globals'
import Block from '../src/lib/block'

describe('Block Tests', () => {
  let genesis: Block

  beforeAll(() => {
    genesis = new Block(0, '', 'Genesis block')
  })

  test('Should be valid', () => {
    const block1 = new Block(1, genesis.hash, 'data of block')
    const validation = block1.isValid(genesis.hash, genesis.index)
    expect(validation.success).toBeTruthy()
  })

  test('Should NOT be valid (timestamp < 1)', () => {
    const block1 = new Block(1, genesis.hash, 'data of block')
    block1.timestamp = -1
    block1.hash = block1.getHash()
    const validation = block1.isValid(genesis.hash, genesis.index)
    expect(validation.success).toBeFalsy()
  })

  test('Should NOT be valid (invalid empty hash)', () => {
    const block1 = new Block(1, genesis.hash, 'data of block')
    block1.hash = ''
    const validation = block1.isValid(genesis.hash, genesis.index)
    expect(validation.success).toBeFalsy()
  })

  test('Should NOT be valid (invalid previous hash)', () => {
    const block1 = new Block(1, 'invalid', 'data of block')
    const validation = block1.isValid(genesis.hash, genesis.index)
    expect(validation.success).toBeFalsy()
  })

  test('Should NOT be valid (invalid empty data)', () => {
    const block1 = new Block(1, genesis.hash, '')
    const validation = block1.isValid(genesis.hash, genesis.index)
    expect(validation.success).toBeFalsy()
  })

  test('Should NOT be valid (invalid negative index)', () => {
    const block1 = new Block(-1, genesis.hash, 'data of block')
    const validation = block1.isValid(genesis.hash, genesis.index)
    expect(validation.success).toBeFalsy()
  })
})
