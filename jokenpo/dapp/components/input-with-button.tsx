'use client'

import { Icons } from './icons'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { useState } from 'react'

interface InputWithButtonProps {
  id: string
  type: string
  label: string
  state: string | number
  setState: Function
  handleChange: Function
}

export default function InputWithButton({
  id,
  type,
  label,
  state,
  setState,
  handleChange,
}: InputWithButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleSend() {
    setIsLoading(true)
    await handleChange()
    setIsLoading(false)
  }

  return (
    <div className="flex flex-col">
      <Label htmlFor={id} className="mb-2">
        {label}
      </Label>

      <div className="flex items-center space-x-2">
        <Input
          id={id}
          type={type}
          className="border-muted-foreground placeholder:text-foreground"
          value={state}
          onChange={(e) => setState(e.target.value)}
        />
        <Button
          type="button"
          variant="ghost"
          onClick={() => handleSend()}
          disabled={isLoading || state === '' || Number(state) === 0}
          className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 dark:from-indigo-300 dark:via-purple-300 dark:to-pink-300"
        >
          {isLoading ? <Icons.loading2 className="h-6 w-6" /> : <Icons.send />}
        </Button>
      </div>
    </div>
  )
}
