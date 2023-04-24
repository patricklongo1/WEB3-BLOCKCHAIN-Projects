import Block from './block'

/**
 * Blockchain Class
 */
export default class Blockchain {
  blocks: Block[]

  constructor() {
    this.blocks = [new Block(0, '', 'Genesis block')]
  }
}
