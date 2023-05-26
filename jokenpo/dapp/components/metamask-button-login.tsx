'use client'

import { connect } from '../services/Ethers3Service'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

export function MetamaskButtonLogin() {
  /* const [status, setStatus] = useState({ message: '', type: '' })
  const [accounts, setAccounts] = useState(['']) */
  const [selectedAccount, setSelectedAccount] = useState('')

  async function handleConnectMetamask() {
    try {
      const { accounts, isAdmin } = await connect()
      alert(isAdmin)
      /* setAccounts(accounts) */
      setSelectedAccount(accounts[0])
    } catch (error: any) {
      console.log(error)
      /* setStatus(
        error.response
          ? { message: error.response.data, type: 'error' }
          : { message: error.message, type: 'error' },
      ) */
    }
  }

  function formatAccount(string: string): string {
    const start = string.substring(0, 5)
    const end = string.substring(string.length - 4)
    const formatted = start.concat('...', end)

    return formatted
  }

  return (
    <>
      {!selectedAccount ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleConnectMetamask}
                className="h-12 w-12 rounded-lg bg-transparent p-2 hover:bg-primary-foreground"
              >
                <Icons.metamask />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Login with MetaMask</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <>
          <code className="relative flex items-center rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
            {formatAccount(selectedAccount)}
            <CopyToClipboard text={selectedAccount}>
              <Button className="ml-2 h-4 bg-transparent p-0 text-foreground hover:bg-transparent hover:text-blue-400">
                <Icons.copy className="h-4 w-4" />
              </Button>
            </CopyToClipboard>
          </code>
          <Icons.metamask className="h-12 w-12" />
        </>
      )}
    </>
  )
}
