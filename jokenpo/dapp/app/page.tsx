/* import { buttonVariants } from '@/components/ui/button'
import { siteConfig } from '@/config/site' */
import Image from 'next/image'

/* import Link from 'next/link' */

export default function IndexPage() {
  return (
    <section className="container flex w-full flex-col items-center justify-center p-20">
      <div className="before:-translate-x-1/1 after:translate-x-1/1 relative mt-8  before:absolute before:h-[50px] before:w-[480px] before:rounded-full before:bg-gradient-radial before:from-gray-300 before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:mt-[-100px] after:h-[220px] after:w-[240px] after:bg-gradient-conic after:from-sky-300 after:via-blue-50 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#00ffff] after:dark:opacity-40 before:lg:h-[360px]" />
      <Image src="/logo512.png" width={250} height={250} alt="logo" />
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
