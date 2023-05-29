import { Skeleton } from './ui/skeleton'

export default function SettingsFormEskeleton() {
  return (
    <>
      <div className="hidden w-full space-x-8 sm:flex">
        <div className="flex w-full space-x-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-16" />
        </div>
        <div className="flex w-full space-x-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-16" />
        </div>
      </div>

      <div className="mt-6 hidden w-full space-x-2 sm:flex">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-16" />
      </div>

      {/* mobile */}
      <div className="mt-6 flex w-full space-x-2 sm:hidden">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-16" />
      </div>
      <div className="mt-6 flex w-full space-x-2 sm:hidden">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-16" />
      </div>
      <div className="mt-6 flex w-full space-x-2 sm:hidden">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-16" />
      </div>
    </>
  )
}
