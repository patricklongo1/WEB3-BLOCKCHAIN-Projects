import Block from './block'
import Validation from '../validation'
import BlockInfo from '../interfaces/blockInfo'
import Transaction from './transaction'
import TransactionSearch from '../interfaces/transactionSearch'
import TransactionInput from './transactionInput'
import TransactionOutput from './transactionOutput'

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
  constructor(miner: string) {
    this.blocks = []
    this.mempool = [new Transaction()]
    this.blocks.push(
      new Block({
        index: 0,
        hash: 'fakehashtoblockchainmock',
        previousHash: '',
        miner: 'mockminer',
        timestamp: Date.now(),
      } as Block),
    )
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
    if (!hash || hash === '-1') {
      return { mempoolIndex: -1, blockIndex: -1 } as TransactionSearch
    }

    return {
      mempoolIndex: 0,
      transaction: new Transaction(),
    } as TransactionSearch
  }

  getBlockByHash(hash: string): Block | undefined {
    if (!hash || hash === '-1') {
      return undefined
    }

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
      transactions: this.mempool.slice(0, 2),
      difficulty: 2,
      previousHash: this.getLastBlock().hash,
      index: this.blocks.length,
      feePerTx: this.getFeePerTx(),
      maxDifficulty: 62,
    } as BlockInfo
  }

  getTxInputs(wallet: string): (TransactionInput | undefined)[] {
    return [
      new TransactionInput({
        fromAddress: wallet,
      } as TransactionInput),
    ]
  }

  getTxOutputs(wallet: string): TransactionOutput[] {
    return [
      new TransactionOutput({
        toAddress: wallet,
      } as TransactionOutput),
    ]
  }

  getUtxo(wallet: string): TransactionOutput[] {
    return this.getTxOutputs(wallet)
  }

  getBalance(wallet: string): number {
    return 10
  }
}
