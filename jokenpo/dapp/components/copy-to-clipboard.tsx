'use client'

import { Icons } from './icons'
import { Button } from '@/components/ui/button'

interface CopyToClipboardProps {
  textToCopy: string
}

export default function CopyToClipboard({ textToCopy }: CopyToClipboardProps) {
  function copyToClipboard() {
    if (!navigator.clipboard) {
      fallbackCopyToClipboard()
      return
    }

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        console.log('Copy successfully')
      })
      .catch((error) => {
        console.error('Copy error:', error)
      })
  }

  function fallbackCopyToClipboard() {
    const textarea = document.createElement('textarea')
    textarea.value = textToCopy
    document.body.appendChild(textarea)
    textarea.select()
    textarea.setSelectionRange(0, textarea.value.length)

    try {
      document.execCommand('copy')
      console.log('Copy successfully')
    } catch (error) {
      console.error('Copy error:', error)
    }

    document.body.removeChild(textarea)
  }

  return (
    <Button
      onClick={copyToClipboard}
      className="ml-3 h-4 bg-transparent p-0 text-foreground hover:bg-transparent hover:text-blue-400"
    >
      <Icons.copy className="h-4 w-4" />
    </Button>
  )
}
