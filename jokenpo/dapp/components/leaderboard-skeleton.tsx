import { Skeleton } from './ui/skeleton'

export default function LeaderboardEskeleton() {
  return (
    <>
      <div className="mx-auto hidden w-[70%] flex-col space-y-1 sm:flex">
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </div>

      {/* mobile */}
      <div className="mt-6 flex w-full flex-col space-y-1 sm:hidden">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </>
  )
}
