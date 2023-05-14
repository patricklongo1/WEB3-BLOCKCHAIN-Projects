'use client'
import { useState } from 'react'
import Image from 'next/image'

import { connect, mint } from '../services/Web3Service'

const MetamaskConnect = () => {
  const [status, setStatus] = useState('')
  const [accounts, setAccounts] = useState([''])
  const [selectedAccount, setSelectedAccount] = useState('')
  const [txHash, setTx] = useState('')

  async function handleConnectMetamask() {
    try {
      const accountsFromMetamask = await connect()
      setAccounts(accountsFromMetamask)
      setSelectedAccount(accountsFromMetamask[0])
    } catch (error: any) {
      setStatus(error.response ? error.response.data : error.message)
    }
  }

  async function handleMint() {
    setStatus('Requesting your tokens. Wait a moment...')
    try {
      const resTxHash = await mint(selectedAccount)
      setStatus(`Your tokens were sent. `)
      setTx(resTxHash)
    } catch (error: any) {
      setStatus(error.message)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {!accounts || !accounts.length || selectedAccount === '' ? (
        <a
          className="flex items-center justify-center bg-gray-900 text-gray-300 py-2 px-4 rounded hover:bg-gray-900 hover:text-gray-100 transition-colors duration-300 mt-2 cursor-pointer max-w-fit"
          onClick={handleConnectMetamask}
        >
          <Image
            src="/metamask.svg"
            alt="MetaMask logo"
            width={45}
            height={45}
          />
          Conect MetaMask
        </a>
      ) : (
        <>
          <small className="text-1xl text-gray-300 font-extrabold text-shadow mt-2">
            Connected as: {selectedAccount}
          </small>
          <a
            className="flex items-center justify-center bg-gray-900 text-gray-300 py-2 px-4 rounded hover:bg-gray-900 hover:text-gray-100 transition-colors duration-300 mt-1 cursor-pointer max-w-fit"
            onClick={handleMint}
          >
            <Image
              src="/metamask.svg"
              alt="MetaMask logo"
              width={45}
              height={45}
            />
            Request ProtoCoins
          </a>
        </>
      )}

      <p className="text-gray-300 mt-1">
        {status}{' '}
        {txHash !== '' && (
          <a
            className="text-blue-400 mt-1 decoratio cursor-pointer underline"
            href={`https://testnet.bscscan.com/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Check TX here
          </a>
        )}{' '}
      </p>
    </div>
  )
}

export default MetamaskConnect
