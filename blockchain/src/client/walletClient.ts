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

async function getBalance() {
  console.clear()

  if (!myWalletPub) {
    console.log("You aren't logged yet.")
    return preMenu()
  }

  const { data } = await axios.get(
    `${BLOCKCHAIN_SERVER_URL}/wallets/${myWalletPub}`,
  )
  console.log('Balance: ', data.balance)
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

      const txInputs = utxo.map((txO) => TransactionInput.fromTxo(txO))
      txInputs.forEach((txI) => txI.sign(myWalletPriv))

      // Transação de transferencia
      const txOutputs = [] as TransactionOutput[]
      txOutputs.push(
        new TransactionOutput({
          toAddress: toWallet,
          amount,
        } as TransactionOutput),
      )

      // transação de troco
      const remainingBalance = balance - amount - fee
      txOutputs.push(
        new TransactionOutput({
          toAddress: myWalletPub,
          amount: remainingBalance,
        } as TransactionOutput),
      )

      const tx = new Transaction({
        txInputs,
        txOutputs,
      } as Transaction)

      tx.hash = tx.getHash()
      tx.txOutputs.forEach((txO) => (txO.tx = tx.hash))

      console.log(tx)
      console.log('Remaining balance: ', remainingBalance)

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
