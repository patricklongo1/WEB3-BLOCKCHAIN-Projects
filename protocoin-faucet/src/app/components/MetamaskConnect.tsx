'use client'
import { useState } from 'react'
import Image from 'next/image'
import ReCAPTCHA from 'react-google-recaptcha'

import { connect, mint } from '../services/Web3Service'

const MetamaskConnect = () => {
  const [status, setStatus] = useState({ message: '', type: '' })
  const [accounts, setAccounts] = useState([''])
  const [selectedAccount, setSelectedAccount] = useState('')
  const [txHash, setTx] = useState('')
  const [captcha, setCaptcha] = useState('')

  async function handleConnectMetamask() {
    try {
      const accountsFromMetamask = await connect()
      setAccounts(accountsFromMetamask)
      setSelectedAccount(accountsFromMetamask[0])
    } catch (error: any) {
      setStatus(
        error.response
          ? { message: error.response.data, type: 'error' }
          : { message: error.message, type: 'error' },
      )
    }
  }

  async function handleMint() {
    if (captcha) {
      setStatus({
        message: 'Requesting your tokens. Wait a moment...',
        type: 'success',
      })
      try {
        const resTxHash = await mint(selectedAccount)
        if (typeof resTxHash === 'object') {
          setStatus({
            message: "You can't receive tokens twice in 24h.",
            type: 'error',
          })
        } else {
          setStatus({ message: `Your tokens were sent. `, type: 'success' })
          setTx(resTxHash)
        }
      } catch (error: any) {
        setStatus({ message: error.message, type: 'error' })
      }
      setCaptcha('')
    } else {
      setStatus({
        message: "Check the 'I am not a robot' first.",
        type: 'error',
      })
    }
  }

  console.log({ status })

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {!accounts || !accounts.length || selectedAccount === '' ? (
        <a
          className="flex items-center justify-center bg-gray-900 text-gray-300 py-2 px-4 rounded hover:bg-gray-900 hover:text-gray-100 transition-colors duration-300 mt-4 cursor-pointer max-w-fit"
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

          {captcha && (
            <a
              className="flex items-center justify-center bg-gray-900 text-gray-300 py-2 px-4 rounded hover:bg-gray-900 hover:text-gray-100 transition-colors duration-300 mt-4 cursor-pointer max-w-fit"
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
          )}

          <div className="inline-flex mt-2">
            <ReCAPTCHA
              sitekey={`${process.env.RECAPTCHA_SITE_KEY}`}
              onChange={(value) => setCaptcha(value || '')}
              style={{ backgroundColor: '#000' }}
              theme="dark"
            />
          </div>
        </>
      )}

      <p
        className={`mt-1 ${
          status.type === 'success' ? 'text-green-300' : 'text-red-300'
        }`}
      >
        {status.message}{' '}
        {txHash !== '' && typeof txHash !== 'object' && (
          <a
            className="text-blue-400 mt-1 decoratio cursor-pointer underline"
            href={`https://testnet.bscscan.com/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Check TX here
          </a>
        )}
      </p>
    </div>
  )
}

export default MetamaskConnect
