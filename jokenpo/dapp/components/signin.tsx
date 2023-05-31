'use client'

import ABI from '../utils/abi.json'
import { Icons } from './icons'
import { Button } from './ui/button'
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@radix-ui/react-tooltip'
import { ethers } from 'ethers'
import Cookies from 'js-cookie'
import { useState } from 'react'

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false)

  async function handleConnectMetamask() {
    setIsLoading(true)
    if (!window.ethereum) {
      throw new Error('No MetaMask found.')
    }

    await window.ethereum.request({
      method: 'eth_requestAccounts',
    })

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const accounts = await provider.listAccounts()

    if (!accounts || !accounts.length) {
      throw new Error('No accounts allowed.')
    }

    const contractAddress = `${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}`

    const contract = new ethers.Contract(contractAddress, ABI, provider)

    let owner
    try {
      owner = await contract.owner()
    } catch (error) {
      setIsLoading(false)
      return console.error('Error calling owner():', error)
    }
    const isAdmin = accounts[0] === owner

    const cookieExpiresInSeconds = 60 * 60 * 24 * 7

    Cookies.set(
      'walletInfos',
      JSON.stringify({
        wallet: accounts[0],
        isAdmin: isAdmin ? 'true' : 'false',
      }),
      {
        path: '/',
        expires: cookieExpiresInSeconds,
      },
    )

    setIsLoading(false)
    window.location.href = '/'
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button onClick={handleConnectMetamask} variant="ghost">
            {!isLoading ? <Icons.metamask /> : <Icons.loading />}
          </Button>
        </TooltipTrigger>
        <TooltipContent className="rounded-md bg-gray-800 p-1 text-base ring-1">
          <p>Connect metamask</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
