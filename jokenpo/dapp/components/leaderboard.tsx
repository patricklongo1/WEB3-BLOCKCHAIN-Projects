'use client'

import ABI from '../utils/abi.json'
import { AlertDestructive } from './error-alert'
import LeaderboardEskeleton from './leaderboard-skeleton'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ethers } from 'ethers'
import { useState, useEffect } from 'react'

interface LbProps {
  wallet: string
  wins: number
}

export default function Leaderboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [leaderboard, setLeaderboard] = useState<LbProps[]>([])

  function getContract() {
    if (!window.ethereum) {
      throw new Error('No MetaMask found.')
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const contractAddress = `${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}`

    const contract = new ethers.Contract(contractAddress, ABI, provider)
    return contract
  }

  useEffect(() => {
    async function loadData() {
      const contract = getContract()
      try {
        const currentLb = await contract.getLeaderBoard()

        const formattedCurrentLb = currentLb.map((item: any) => ({
          wallet: item.wallet,
          wins: item.wins,
        }))

        setLeaderboard(formattedCurrentLb)
        setIsLoading(false)
      } catch (error: any) {
        console.log(error)
        setError(error.message)
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  return (
    <>
      <>
        {isLoading ? (
          <LeaderboardEskeleton />
        ) : (
          <Table className="mx-auto w-full rounded-lg bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 font-semibold text-foreground dark:text-secondary md:w-[70%]">
            <TableCaption className="mb-6">
              🚀 A list of the best players of the world.
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[full] text-center">
                  Wallet address
                </TableHead>
                <TableHead className="text-center">Wins</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboard.map((lb: LbProps) => (
                <TableRow key={lb.wallet}>
                  <TableCell className="text-center text-xs md:text-base">
                    {lb.wallet}
                  </TableCell>
                  <TableCell className="text-center">{lb.wins}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </>
      {error && <AlertDestructive message={error} />}
    </>
  )
}
