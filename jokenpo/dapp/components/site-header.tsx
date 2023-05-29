import { MetamaskButtonLogin } from './metamask-button-login'
import { Icons } from '@/components/icons'
import { MainNav } from '@/components/main-nav'
import { ThemeToggle } from '@/components/theme-toggle'
import { buttonVariants } from '@/components/ui/button'
import { siteConfig } from '@/config/site'
import { cookies } from 'next/headers'
import Link from 'next/link'

export function SiteHeader() {
  const walletInfosStringfied = cookies().get('walletInfos')?.value
  let isAdmin = 'false'
  if (walletInfosStringfied) {
    const walletInfos = JSON.parse(walletInfosStringfied)
    isAdmin = walletInfos.isAdmin
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-transparent">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2 text-foreground">
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className="hidden md:flex"
            >
              <div
                className={buttonVariants({
                  size: 'sm',
                  variant: 'ghost',
                })}
              >
                <Icons.gitHub className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
            <ThemeToggle />
            {isAdmin !== 'false' && (
              <Link href="/settings">
                <Icons.settings />
              </Link>
            )}
            <MetamaskButtonLogin />
          </nav>
        </div>
      </div>
      <div className="h-px bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300" />
    </header>
  )
}
