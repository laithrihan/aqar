type LogoProps = {
  variant?: 'default' | 'onPrimary'
}

/** Brand house mark SVG. */
function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M4 14.5L16 5l12 9.5V27a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V14.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M12 28V18h8v10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export { LogoMark }
export type { LogoProps }
