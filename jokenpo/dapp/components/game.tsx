/* eslint-disable no-unused-vars */
'use client'

import paperImg from '../assets/paper.png'
import rockImg from '../assets/rock.png'
import scissorsImg from '../assets/scissors.png'
import ABI from '../utils/abi.json'
import { AlertDestructive } from './error-alert'
import { Button } from '@/components/ui/button'
import { ethers } from 'ethers'
import Cookies from 'js-cookie'
import Image from 'next/image'
import { useEffect, useState } from 'react'

enum Options {
  NONE,
  ROCK,
  PAPER,
  SCISSORS,
} // 0, 1, 2, 3

export default function Game() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoadingStatus, setIsLoadingStatus] = useState(true)
  const [thePlay, setThePlay] = useState<Options | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState('')

  function getContract() {
    if (!window.ethereum) {
      throw new Error('No MetaMask found.')
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const contractAddress = `${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}`

    const contract = new ethers.Contract(contractAddress, ABI, provider)
    return contract
  }

  async function getContractWithSigner() {
    if (!window.ethereum) {
      throw new Error('No MetaMask found.')
    }

    await window.ethereum.enable()

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    let signer
    try {
      signer = provider.getSigner()
    } catch (error) {
      console.log(error)
    }

    const contractAddress = `${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}`
    const contract = new ethers.Contract(contractAddress, ABI, signer)
    return contract
  }

  useEffect(() => {
    const isAuth = Cookies.get('walletInfos')
    if (isAuth) {
      setIsAuthenticated(true)
    }

    async function loadStatus() {
      const contract = getContract()

      try {
        const currentStatus = await contract.getResult()
        setStatus(currentStatus)
        setIsLoadingStatus(false)
      } catch (error: any) {
        console.log(error)
        setError(`Error while load status from contract: ${error.message}`)
        setIsLoadingStatus(false)
      }
    }
    loadStatus()
  }, [])

  async function reloadStatus() {
    setIsLoadingStatus(true)
    const contract = getContract()

    try {
      const currentStatus = await contract.getResult()
      setStatus(currentStatus)
      setIsLoadingStatus(false)
    } catch (error: any) {
      console.log(error)
      setError(`Error while load status from contract: ${error.message}`)
      setIsLoadingStatus(false)
    }
  }

  function extractReasonFromError(errorString: string) {
    const reasonRegex = /reason="([^"]+)"/
    const matches = errorString.match(reasonRegex)
    if (matches && matches.length > 1) {
      return matches[1]
    }
    return null
  }

  async function play(option: Options) {
    setThePlay(option)
    const contract = await getContractWithSigner()
    const value = ethers.utils.parseUnits('0.01', 'ether')
    try {
      const tx = await contract.play(option, { value })
      await tx.wait()
      await reloadStatus()
      setThePlay(null)
    } catch (error: any) {
      setError(`${extractReasonFromError(error.message)}`)
      setThePlay(null)
    }
  }

  return (
    <>
      <div className="flex min-w-full flex-col rounded-lg bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300 text-sm drop-shadow-lg dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 sm:text-lg">
        <h3 className="mt-8 scroll-m-20 text-center font-mono text-2xl font-semibold tracking-tight dark:text-secondary-foreground">
          The current status
        </h3>
        <div className="flex h-10 w-[98%] items-center justify-center self-center rounded-lg bg-foreground dark:bg-background">
          <p
            className={`text-center text-xs leading-7 text-primary-foreground dark:text-secondary-foreground sm:text-lg ${
              isLoadingStatus && 'animate-pulse'
            }`}
          >
            {status || 'Loading...'}
          </p>
        </div>

        <h3
          className={`mt-8 scroll-m-20 text-center font-mono text-2xl font-semibold tracking-tight dark:text-secondary-foreground ${
            status.includes('won') && !isLoadingStatus && 'animate-pulse'
          }`}
        >
          {isAuthenticated
            ? status.includes('won')
              ? 'Start a new game'
              : 'Play this game'
            : 'Login with metamask to play'}
        </h3>

        <div className="mx-auto my-8 flex w-full items-center justify-around md:w-[60%]">
          <Button
            variant="outline"
            onClick={() => play(Options.ROCK)}
            disabled={thePlay !== null || !isAuthenticated}
            className="h-20 w-20 rounded-lg bg-yellow-50 transition-colors hover:bg-yellow-200 md:h-48 md:w-48"
          >
            <Image
              src={rockImg}
              alt="rockImage"
              width={180}
              height={180}
              className={`${thePlay === Options.ROCK && 'animate-bounce'}`}
            />
          </Button>

          <Button
            variant="outline"
            onClick={() => play(Options.PAPER)}
            disabled={thePlay !== null || !isAuthenticated}
            className="h-20 w-20 rounded-lg bg-cyan-50 transition-colors hover:bg-cyan-200 md:h-48 md:w-48"
          >
            <Image
              src={paperImg}
              alt="paperImage"
              width={180}
              height={180}
              className={`${thePlay === Options.PAPER && 'animate-bounce'}`}
            />
          </Button>

          <Button
            variant="outline"
            onClick={() => play(Options.SCISSORS)}
            disabled={thePlay !== null || !isAuthenticated}
            className="h-20 w-20 rounded-lg bg-pink-50 transition-colors hover:bg-pink-200 md:h-48 md:w-48"
          >
            <Image
              src={scissorsImg}
              alt="scissorsImage"
              width={180}
              height={180}
              className={`${thePlay === Options.SCISSORS && 'animate-bounce'}`}
            />
          </Button>
        </div>
      </div>
      <div className="mt-4">
        {error && <AlertDestructive message={error} />}
      </div>
    </>
  )
}
