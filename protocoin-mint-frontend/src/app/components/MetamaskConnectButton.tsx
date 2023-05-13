'use client'
import Image from 'next/image'
import React from 'react'

import { mint } from '../services/Web3Service'

const MetamaskConnectButton = () => {
  async function handleConnectMetamask() {
    try {
      const txHash = await mint()
      alert(txHash)
    } catch (error: any) {
      alert(error.message)
    }
  }

  return (
    <a
      className="flex items-center bg-gray-900 text-gray-300 py-2 px-4 rounded hover:bg-gray-900 hover:text-gray-100 transition-colors duration-300 mt-2 cursor-pointer"
      onClick={handleConnectMetamask}
    >
      <Image src="/metamask.svg" alt="MetaMask logo" width={45} height={45} />
      Conecte MetaMask
    </a>
  )
}

export default MetamaskConnectButton
