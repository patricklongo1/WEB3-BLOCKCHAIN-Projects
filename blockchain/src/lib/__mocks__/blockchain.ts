import Block from './block'
import Validation from '../validation'

/**
 * Mock Blockchain Class
 */
export default class Blockchain {
  blocks: Block[]
  nextIndex: number = 1

  /**
   * Creates a new mock blockchain
   */
  constructor() {
    this.blocks = [
      new Block(
        new Block({
          index: 0,
          hash: 'fakehashtoblockchainmock',
          previousHash: '',
          timestamp: Date.now(),
          data: 'Genesis block',
        } as Block),
      ),
    ]
  }

  getLastBlock(): Block {
    return this.blocks[this.blocks.length - 1]
  }

  addBlock(block: Block): Validation {
    if (block.index < 0) return new Validation(false, 'Invalid block')

    this.blocks.push(block)
    this.nextIndex++
    return new Validation()
  }

  getBlockByHash(hash: string): Block | undefined {
    return this.blocks.find((b) => b.hash === hash)
  }

  isValid(): Validation {
    return new Validation()
  }
}
