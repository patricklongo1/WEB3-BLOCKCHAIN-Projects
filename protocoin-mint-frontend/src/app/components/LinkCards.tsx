interface LinkCardsProps {
  href: string
  title: string
  content: string
}

const LinkCards = ({ href, title, content }: LinkCardsProps) => {
  return (
    <a
      href={href}
      className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-700 hover:bg-gray-800 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
      target="_blank"
      rel="noopener noreferrer"
    >
      <h2 className={`mb-3 text-2xl font-semibold text-gray-200`}>
        {title}{' '}
        <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
          -&gt;
        </span>
      </h2>
      <p className={`m-0 max-w-[30ch] text-sm opacity-50 text-gray-200`}>
        {content}
      </p>
    </a>
  )
}

export default LinkCards
