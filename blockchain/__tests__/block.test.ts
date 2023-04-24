import { describe, test, expect } from '@jest/globals'
import Block from '../src/lib/block'

describe('Block Tests', () => {
  test('Should be valid', () => {
    const block1 = new Block(1, 'abc', 'data of block')
    const valid = block1.isValid()
    expect(valid).toBeTruthy()
  })

  test('Should NOT be valid (timestamp < 1)', () => {
    const block1 = new Block(1, 'abc', 'data of block')
    block1.timestamp = -1
    const valid = block1.isValid()
    expect(valid).toBeFalsy()
  })

  test('Should NOT be valid (invalid empty hash)', () => {
    const block1 = new Block(1, 'abc', 'data of block')
    block1.hash = ''
    const valid = block1.isValid()
    expect(valid).toBeFalsy()
  })

  test('Should NOT be valid (invalid previous hash)', () => {
    const block1 = new Block(1, '', 'data of block')
    const valid = block1.isValid()
    expect(valid).toBeFalsy()
  })

  test('Should NOT be valid (invalid empty data)', () => {
    const block1 = new Block(1, 'abc', '')
    const valid = block1.isValid()
    expect(valid).toBeFalsy()
  })

  test('Should NOT be valid (invalid negative index)', () => {
    const block1 = new Block(-1, 'abc', 'data of block')
    const valid = block1.isValid()
    expect(valid).toBeFalsy()
  })
})
