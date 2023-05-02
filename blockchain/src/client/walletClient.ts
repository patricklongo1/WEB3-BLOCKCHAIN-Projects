import dotenv from 'dotenv'
import Wallet from '../lib/wallet'
import axios from 'axios'
import readline from 'readline'
import Transaction from '../lib/transaction'
import TransactionType from '../lib/interfaces/transactionType'
import TransactionInput from '../lib/transactionInput'
import TransactionOutput from '../lib/transactionOutput'
dotenv.config()

const BLOCKCHAIN_SERVER_URL = process.env.BLOCKCHAIN_SERVER_URL
let myWalletPub = ''
let myWalletPriv = ''

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function menu() {
  setTimeout(() => {
    console.clear()

    if (myWalletPub) {
      console.log(`You are logged as: ${myWalletPub}`)
    } else {
      console.log("You aren't logged.\n")
    }

    rl.question(
      'Choose youe option: \n1 - Create Wallet\n2 - Recover Wallet\n3 - Balance\n4 - Send Transaction\n5 - Search Transaction\n\n',
      (answer) => {
        switch (answer) {
          case '1':
            createWallet()
            break
          case '2':
            recoverWallet()
            break
          case '3':
            getBalance()
            break
          case '4':
            sendTx()
            break
          case '5':
            searchTx()
            break

          default:
            console.log('Wrong option!')
            menu()
            break
        }
      },
    )
  }, 1000)
}

function preMenu() {
  rl.question('Pressione qualquer tecla para continuar: ', () => {
    menu()
  })
}

function createWallet() {
  console.clear()
  const wallet = new Wallet()
  console.log(`Your new wallet: `)
  console.log(wallet)
  console.log(
    "!IMPORTANT: Do you need to save this wallet private key. You can't recover your wallet without private key.",
  )

  myWalletPub = wallet.publicKey
  myWalletPriv = wallet.privateKey

  preMenu()
}

function recoverWallet() {
  console.clear()
  rl.question('What is your private key or WIF?\n', (wifOrPrivateKey) => {
    const wallet = new Wallet(wifOrPrivateKey)
    console.log(`Your recovered wallet: `)
    console.log(wallet)

    myWalletPub = wallet.publicKey
    myWalletPriv = wallet.privateKey
    preMenu()
  })
}

function getBalance() {
  console.clear()

  if (!myWalletPub) {
    console.log("You aren't logged yet.")
    return preMenu()
  }

  // TODO: get balance by API
  preMenu()
}

function sendTx() {
  console.clear()

  if (!myWalletPub) {
    console.log("You aren't logged yet.")
    return preMenu()
  }

  console.log(`Your wallet: ${myWalletPub}`)
  rl.question('To wallet: ', (toWallet) => {
    if (toWallet.length < 66) {
      console.log('Invalid wallet.')
      return preMenu()
    }

    rl.question('Amount: ', async (strAmount) => {
      const amount = Number(strAmount)
      if (amount < 1) {
        console.log('Invalid amount.')
        return preMenu()
      }

      const walletResponse = await axios.get(
        `${BLOCKCHAIN_SERVER_URL}/wallets/${myWalletPub}`,
      )
      const balance = walletResponse.data.balance as number
      const fee = walletResponse.data.fee as number
      const utxo = walletResponse.data.utxo as TransactionOutput[]

      if (balance < amount + fee) {
        console.log('Insufficient balance (tx + fee).')
        return preMenu()
      }

      const tx = new Transaction()
      tx.timestamp = Date.now()
      tx.txOutputs = [
        new TransactionOutput({
          toAddress: toWallet,
          amount,
        } as TransactionOutput),
      ]
      tx.type = TransactionType.REGULAR
      tx.txInputs = [
        new TransactionInput({
          amount,
          fromAddress: myWalletPub,
          previousTx: utxo[0].tx,
        } as TransactionInput),
      ]

      tx.txInputs[0].sign(myWalletPriv)
      tx.hash = tx.getHash()
      tx.txOutputs[0].tx = tx.hash

      try {
        await axios.post(`${BLOCKCHAIN_SERVER_URL}/transactions`, tx)
        console.log(`Transaction accepted. Waiting the miners!`)
      } catch (error: any) {
        console.error(error.response ? error.response.data : error.message)
      }
      return preMenu()
    })
  })

  preMenu()
}

function searchTx() {
  console.clear()

  rl.question('What is your transaction hash?\n', async (txHash) => {
    try {
      const response = await axios.get(
        `${BLOCKCHAIN_SERVER_URL}/transactions/${txHash}`,
      )
      console.log(response.data)
      return preMenu()
    } catch (error: any) {
      console.error(error.response ? error.response.data : error.message)
    }
  })
}

menu()
