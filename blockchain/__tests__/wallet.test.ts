import { describe, test, expect, beforeAll } from '@jest/globals'
import Wallet from '../src/lib/wallet'

describe('Wallet Tests', () => {
  const exampleWif = '5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ'
  let alice: Wallet

  beforeAll(() => {
    alice = new Wallet()
  })

  test('Should generate wallet', () => {
    const wallet = new Wallet()

    expect(wallet.privateKey).toBeTruthy()
    expect(wallet.publicKey).toBeTruthy()
  })

  test('Should recover a wallet (PK)', () => {
    const wallet = new Wallet(alice.privateKey)

    expect(wallet.privateKey).toEqual(alice.privateKey)
    expect(wallet.publicKey).toBeTruthy()
  })

  test('Should recover a wallet (WIF)', () => {
    const wallet = new Wallet(exampleWif)

    expect(wallet.privateKey).toBeTruthy()
    expect(wallet.publicKey).toBeTruthy()
  })

  /* test('Should NOT recover a wallet', () => {
    const wallet = new Wallet('XPTO')

    expect(wallet.privateKey).toBeTruthy()
    expect(wallet.publicKey).toBeTruthy()
  }) */
})
