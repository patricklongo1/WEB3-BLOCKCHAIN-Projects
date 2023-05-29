import CopyToClipboard from './copy-to-clipboard'
import { Icons } from '@/components/icons'
import { cookies } from 'next/headers'

export function Profile() {
  const walletInfosStringfied = cookies().get('walletInfos')!.value
  const walletInfos = JSON.parse(walletInfosStringfied)
  const { wallet } = walletInfos

  function formatAccount(string: string): string {
    const start = string.substring(0, 5)
    const end = string.substring(string.length - 4)
    const formatted = start.concat('...', end)

    return formatted
  }

  return (
    <>
      <code className="flex items-center rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
        {formatAccount(wallet)}
        <CopyToClipboard textToCopy={wallet} />
      </code>
      <a
        href="/api/auth/logout"
        className="block text-red-400 hover:text-red-300"
      >
        <Icons.logout className="ml-1" />
      </a>
    </>
  )
}
