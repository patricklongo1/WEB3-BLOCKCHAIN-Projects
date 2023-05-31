'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import Cookies from 'js-cookie'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export function RulesDialog() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const rulesCookie = Cookies.get('rules')
    if (!rulesCookie || rulesCookie !== 'read') {
      setOpen(true)
    }
  }, [])

  const cookieExpiresInSeconds = 60 * 60 * 24 * 7

  function handleCloseDialog() {
    Cookies.set('rules', 'read', {
      path: '/',
      expires: cookieExpiresInSeconds,
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleCloseDialog}>
      <DialogContent className="bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 py-16 ring-2 ring-purple-400 md:max-w-[1050px]">
        <DialogHeader>
          <DialogTitle className="text-primary-foreground">
            First time here? WELCOME. Here is some JoKenPo dApp information and
            rules
          </DialogTitle>
          <DialogDescription className="text-primary-foreground">
            This is a project developed in a didactic context, and does not
            support bets of any kind. The project is under MIT license.
          </DialogDescription>
        </DialogHeader>
        <div className="relative">
          <Image
            src="/logo512.png"
            alt="logo"
            width={250}
            height={250}
            className="absolute right-0 mr-[-90px] mt-[-70px] h-28 w-28 animate-bounce rounded-full shadow-2xl shadow-gray-900 md:h-[250px] md:w-[250px]"
          />
          <ul className="text-md my-6 ml-6 list-disc text-primary-foreground md:text-lg [&>li]:mt-2">
            <li>In this version, only one game is played at a time.</li>
            <li>The bar inside the card shows the state of the game.</li>
            <li>
              If the last game ended, you can start a new one as Player 1.
            </li>
            <li>
              If another player has already made the first move, you can
              continue as Player 2.
            </li>
            <li>
              To play, simply select Rock, Paper, or Scissors and proceed with
              payment in metamask.
            </li>
            <li>
              You pay 0.01 BNB (testnet) to play, just like your opponent. The
              winner takes 90% of the total value of the round.
            </li>
          </ul>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleCloseDialog}>
            Amazing! Play now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
