import Transaction from '../transaction'

/**
 * The BlockInfo interface to miners mine a new Block
 */
export default interface BlockInfo {
  index: number
  previousHash: string
  difficulty: number
  maxDifficulty: number
  feePerTx: number
  transactions: Transaction[]
}
