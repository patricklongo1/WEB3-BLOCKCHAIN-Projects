'use client'

import ABI from '../utils/abi.json'
import { AlertDestructive } from './error-alert'
import { AlertInfo } from './info-alert'
import InputWithButton from './input-with-button'
import SettingsFormEskeleton from './settings-form-skeleton'
import { ethers } from 'ethers'
import { useState, useEffect } from 'react'

type InfoData = {
  message: string
  hash: string
}

export function SettingsForm() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<InfoData | null>(null)
  const [bid, setBid] = useState(0)
  const [commission, setCommission] = useState(0)
  const [contract, setContract] = useState(
    '0x0000000000000000000000000000000000000000',
  )

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
    async function loadInfos() {
      const contract = getContract()

      try {
        const currentBid = await contract.getBid()
        setBid(currentBid)
        const currentComission = await contract.getCommission()
        setCommission(currentComission)
        const currentContract = await contract.getAddress()
        setContract(currentContract)
        setIsLoading(false)
      } catch (error: any) {
        console.log(error)
        setError(`Error while load infos from contract: ${error.message}`)
        setIsLoading(false)
      }
    }
    loadInfos()
  }, [])

  async function handleChangeBid() {
    try {
      const contract = await getContractWithSigner()

      const tx = await contract.setBid(bid)
      await tx.wait()

      setStatus({
        message: `Your transaction is in progress. You can check `,
        hash: tx.hash,
      })
    } catch (error: any) {
      console.log(error)
      setError(`Error while update bid: ${error.message}`)
    }
  }

  async function handleChangeCommission() {
    try {
      const contract = await getContractWithSigner()

      const tx = await contract.setCommission(commission)
      await tx.wait()

      setStatus({
        message: `Your transaction is in progress. You can check `,
        hash: tx.hash,
      })
    } catch (error: any) {
      console.log(error)
      setError(`Error while update commission: ${error.message}`)
    }
  }

  async function handleChangeContract() {
    try {
      const instanceContract = await getContractWithSigner()

      const tx = await instanceContract.upgrade(contract)
      await tx.wait()

      setStatus({
        message: `Your transaction is in progress. You can check `,
        hash: tx.hash,
      })
    } catch (error: any) {
      console.log(error)
      setError(`Error while upgrade contract: ${error.message}`)
    }
  }

  return (
    <>
      {isLoading ? (
        <SettingsFormEskeleton />
      ) : (
        <>
          {error && (
            <div className="mb-6 w-full">
              <AlertDestructive message={error} />
            </div>
          )}
          {status && (
            <div className="mb-6 w-full">
              <AlertInfo message={status.message} hash={status.hash} />
            </div>
          )}
          <div className="flex flex-col lg:flex-row lg:flex-wrap">
            <div className="mt-4 lg:w-[49%]">
              <InputWithButton
                id="bid"
                type="number"
                label="Bid value (wei)"
                state={bid}
                setState={setBid}
                handleChange={handleChangeBid}
              />
            </div>

            <div className="mt-4 lg:ml-auto lg:w-[49%]">
              <InputWithButton
                id="commission"
                type="number"
                label="Commission value (%)"
                state={commission}
                setState={setCommission}
                handleChange={handleChangeCommission}
              />
            </div>

            <div className="mt-4 w-full">
              <InputWithButton
                id="contract"
                type="string"
                label="New contract (address)"
                state={contract}
                setState={setContract}
                handleChange={handleChangeContract}
              />
            </div>
          </div>
        </>
      )}
    </>
  )
}
