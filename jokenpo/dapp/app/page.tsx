/* import { buttonVariants } from '@/components/ui/button'
import { siteConfig } from '@/config/site' */
import Image from 'next/image'

/* import Link from 'next/link' */

export default function IndexPage() {
  return (
    <section className="container flex w-full flex-col items-center justify-center p-20">
      <div className="relative">
        <Image src="/logo512.png" width={250} height={250} alt="logo" />
        <div className="absolute inset-0 bg-gradient-conic from-indigo-300 via-purple-300 to-pink-300 opacity-70 blur-3xl"></div>
      </div>
      <div className="flex gap-4">
        {/* <Link
          href={siteConfig.links.docs}
          target="_blank"
          rel="noreferrer"
          className={buttonVariants({ size: 'lg' })}
        >
          Documentation
        </Link>
        <Link
          target="_blank"
          rel="noreferrer"
          href={siteConfig.links.github}
          className={buttonVariants({ variant: 'outline', size: 'lg' })}
        >
          GitHub
        </Link> */}
      </div>
    </section>
  )
}
