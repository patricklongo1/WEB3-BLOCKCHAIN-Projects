import { Icons } from '../../components/icons'

export default function Loading() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center">
      <Icons.loading />
      <h1 className="mt-8 font-mono text-sm font-semibold leading-relaxed sm:text-lg">
        Loading...
      </h1>
    </div>
  )
}
