import Block from './block'
import Validation from '../validation'
import BlockInfo from '../interfaces/blockInfo'
import Transaction from './transaction'
import TransactionType from '../interfaces/transactionType'
import TransactionSearch from '../interfaces/transactionSearch'

/**
 * Mock Blockchain Class
 */
export default class Blockchain {
  blocks: Block[]
  mempool: Transaction[]
  nextIndex: number = 1

  /**
   * Creates a new mock blockchain
   */
  constructor() {
    this.mempool = [
      new Transaction({
        data: 'tx1',
      } as Transaction),
    ]
    this.blocks = [
      new Block(
        new Block({
          index: 0,
          hash: 'fakehashtoblockchainmock',
          previousHash: '',
          timestamp: Date.now(),
          transactions: [
            new Transaction({
              type: TransactionType.FEE,
              data: new Date().toString(),
            } as Transaction),
          ],
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

  addTransaction(transaction: Transaction): Validation {
    const validation = transaction.isValid()
    if (!validation.success) {
      return validation
    }

    this.mempool.push(transaction)
    return new Validation()
  }

  getTransaction(hash: string): TransactionSearch {
    return {
      mempoolIndex: 0,
      transaction: { hash },
    } as TransactionSearch
  }

  getBlockByHash(hash: string): Block | undefined {
    return this.blocks.find((b) => b.hash === hash)
  }

  isValid(): Validation {
    return new Validation()
  }

  getFeePerTx(): number {
    return 1
  }

  getNextBlock(): BlockInfo {
    return {
      transactions: [
        new Transaction({
          data: new Date().toString(),
        } as Transaction),
      ],
      difficulty: 0,
      previousHash: this.getLastBlock().hash,
      index: 1,
      feePerTx: this.getFeePerTx(),
      maxDifficulty: 62,
    } as BlockInfo
  }
}
