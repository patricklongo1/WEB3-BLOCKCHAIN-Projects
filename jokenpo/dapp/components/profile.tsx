import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { cookies } from 'next/headers'

/* import { CopyToClipboard } from 'react-copy-to-clipboard' */

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
        {/* <CopyToClipboard text={wallet}> */}
        <Button className="ml-3 h-4 bg-transparent p-0 text-foreground hover:bg-transparent hover:text-blue-400">
          <Icons.copy className="h-4 w-4" />
        </Button>
        {/* </CopyToClipboard> */}
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
