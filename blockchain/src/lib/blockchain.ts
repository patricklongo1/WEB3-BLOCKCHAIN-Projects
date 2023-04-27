import Block from './block'
import Validation from './validation'
import BlockInfo from './interfaces/blockInfo'

/**
 * Blockchain Class
 */
export default class Blockchain {
  blocks: Block[]
  nextIndex: number = 1
  static readonly DIFFICULTY_FACTOR = 5
  static readonly MAX_DIFFICULTY = 62

  /**
   * Creates a new blockchain
   */
  constructor() {
    this.blocks = [
      new Block(
        new Block({
          data: 'Genesis block',
        } as Block),
      ),
    ]
  }

  getLastBlock(): Block {
    return this.blocks[this.blocks.length - 1]
  }

  getDifficulty(): number {
    return Math.ceil(this.blocks.length / Blockchain.DIFFICULTY_FACTOR)
  }

  addBlock(block: Block): Validation {
    const lastBlock = this.getLastBlock()
    const validation = block.isValid(
      lastBlock.hash,
      lastBlock.index,
      this.getDifficulty(),
    )
    if (!validation.success)
      return new Validation(false, `Invalid block: ${validation.message}`)
    this.blocks.push(block)
    this.nextIndex++
    return new Validation()
  }

  getBlockByHash(hash: string): Block | undefined {
    return this.blocks.find((b) => b.hash === hash)
  }

  isValid(): Validation {
    for (let i = this.blocks.length - 1; i > 0; i--) {
      const currentBlock = this.blocks[i]
      const previousBlock = this.blocks[i - 1]
      const validation = currentBlock.isValid(
        previousBlock.hash,
        previousBlock.index,
        this.getDifficulty(),
      )
      if (!validation.success)
        return new Validation(
          false,
          `Invalid block #${currentBlock.index}: ${validation.message}`,
        )
    }
    return new Validation()
  }

  getFeePerTx(): number {
    return 1
  }

  getNextBlock(): BlockInfo {
    const data = new Date().toString()
    const difficulty = this.getDifficulty()
    const previousHash = this.getLastBlock().hash
    const index = this.blocks.length
    const feePerTx = this.getFeePerTx()
    const maxDifficulty = Blockchain.MAX_DIFFICULTY

    return {
      data,
      difficulty,
      previousHash,
      index,
      feePerTx,
      maxDifficulty,
    } as BlockInfo
  }
}
