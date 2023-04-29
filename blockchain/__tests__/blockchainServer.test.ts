import request from 'supertest'
import { describe, test, expect, jest } from '@jest/globals'
import { app } from '../src/server/blockchainServer'
import Block from '../src/lib/block'
import Transaction from '../src/lib/transaction'
import TransactionInput from '../src/lib/transactionInput'

jest.mock('../src/lib/transaction')
jest.mock('../src/lib/block')
jest.mock('../src/lib/blockchain')
jest.mock('../src/lib/transactionInput')

describe('BlockchainServer Tests', () => {
  // BLOCKCHAIN
  test('GET /status - Should return blockchain status', async () => {
    const response = await request(app).get('/status')

    expect(response.status).toEqual(200)
    expect(response.body.isValid.success).toEqual(true)
  })

  // BLOCKS
  test('GET /blocks/next - Should get next block to mine infos', async () => {
    const response = await request(app).get('/blocks/next')

    expect(response.status).toEqual(200)
    expect(response.body.index).toEqual(1) // Test blockchain version has a genis block #0
  })

  test('GET /blocks/:index - Should get genesis', async () => {
    const response = await request(app).get('/blocks/0') // Genesis index === 0

    expect(response.status).toEqual(200)
    expect(response.body.index).toEqual(0)
  })

  test('GET /blocks/:hash - Should get block', async () => {
    const response = await request(app).get('/blocks/fakehashtoblockchainmock') // Genesis hash by mock === fakehashtoblockchainmock

    expect(response.status).toEqual(200)
    expect(response.body.hash).toEqual('fakehashtoblockchainmock')
  })

  test('GET /blocks/:index - Should NOT get block', async () => {
    const response = await request(app).get('/blocks/-1')

    expect(response.status).toEqual(404)
  })

  test('POST /blocks - Should add block', async () => {
    const block = new Block({
      index: 1,
    } as Block)
    const response = await request(app).post('/blocks').send(block)

    expect(response.status).toEqual(201)
    expect(response.body.index).toEqual(1)
  })

  test('POST /blocks - Should NOT add block (invalid)', async () => {
    const block = new Block({
      index: -1,
    } as Block)
    const response = await request(app).post('/blocks').send(block)

    expect(response.status).toEqual(400)
  })

  test('POST /blocks - Should NOT add block (empty)', async () => {
    const response = await request(app).post('/blocks').send({})

    expect(response.status).toEqual(422)
  })

  // TRANSACTIONS
  test('GET /transactions - Should get transactions', async () => {
    const response = await request(app).get('/transactions')

    expect(response.status).toEqual(200)
    expect(response.body.total).toEqual(1)
  })

  test('GET /transactions/:hash - Should get transaction', async () => {
    const response = await request(app).get('/transactions/mockhash') // mock transaction hash === mockhash

    expect(response.status).toEqual(200)
    expect(response.body.mempoolIndex).toEqual(0)
  })

  test('POST /transactions - Should add tx', async () => {
    const tx = new Transaction({
      txInput: new TransactionInput(),
      to: 'toWallet',
    } as Transaction)

    const response = await request(app).post('/transactions').send(tx)
    expect(response.status).toEqual(201)
  })

  test('POST /transactions - Should NOT add tx (no hash in body)', async () => {
    const txBody = {
      type: 1,
      timestamp: 1,
      data: 'tx1',
    }

    const response = await request(app).post('/transactions').send(txBody)
    expect(response.status).toEqual(422)
  })

  test('POST /transactions - Should NOT add tx (invalid tx)', async () => {
    const tx = new Transaction({
      txInput: new TransactionInput(),
    } as Transaction)

    const response = await request(app).post('/transactions').send(tx)
    expect(response.status).toEqual(400)
    expect(response.body.success).toBeFalsy()
  })
})
