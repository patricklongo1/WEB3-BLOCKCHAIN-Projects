import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Info } from 'lucide-react'

interface AlertInfoProps {
  message: string
  hash: string
}

export function AlertInfo({ message, hash }: AlertInfoProps) {
  return (
    <Alert>
      <Info className="h-4 w-4" />
      <AlertTitle>Info:</AlertTitle>
      <AlertDescription>
        <p>
          {message}
          <a
            className="text-blue-600 underline dark:text-blue-300"
            href={`https://testnet.bscscan.com/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Here
          </a>
        </p>
      </AlertDescription>
    </Alert>
  )
}
