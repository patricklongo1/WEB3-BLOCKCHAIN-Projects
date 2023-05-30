import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

interface AlertDestructiveProps {
  message: string
}

export function AlertDestructive({ message }: AlertDestructiveProps) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className="overflow-hidden">{message}</AlertDescription>
    </Alert>
  )
}
