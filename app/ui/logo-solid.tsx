interface LogoSolidProps {
  size: number
  className?: string
  id?: string
}

export default function LogoSolid({ size, className }: LogoSolidProps) {
  return (
    <svg
      width={size}
      height={size}
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 97 95'
      className={className}
      role='img'
      aria-label='Early Access Logo'
    >
      <path
        stroke='currentColor'
        strokeWidth='1'
        d='M51.195 22.717a5 5 0 0 0 2.518 4.34l12.39 7.085c3.336 1.907 7.488-.505 7.482-4.348l-.02-14.092a5 5 0 0 0-2.516-4.332L58.68 4.286c-3.333-1.909-7.485.498-7.485 4.339v14.092z'
      />
      <path
        stroke='currentColor'
        strokeWidth='1'
        d='M81.079 42.705c-3.333-1.906-7.482.501-7.482 4.34v14.1a5 5 0 0 0 2.518 4.34l12.354 7.063c3.327 1.903 7.47-.493 7.481-4.326l.041-14.075a5 5 0 0 0-2.518-4.355L81.08 42.705z'
      />
      <path
        stroke='currentColor'
        strokeWidth='1'
        d='M23.416 29.794c-.006 3.843 4.146 6.255 7.482 4.348l12.39-7.084a5 5 0 0 0 2.518-4.34V8.624c0-3.841-4.152-6.248-7.485-4.339l-12.369 7.085a5 5 0 0 0-2.515 4.331l-.02 14.092z'
      />
      <path
        stroke='currentColor'
        strokeWidth='1'
        d='M20.884 65.485a5 5 0 0 0 2.518-4.34v-14.1c0-3.84-4.148-6.246-7.481-4.34L3.527 49.79a5 5 0 0 0-2.518 4.356l.041 14.075c.011 3.833 4.154 6.228 7.482 4.326l12.352-7.063z'
      />
      <path
        stroke='currentColor'
        strokeWidth='1'
        d='M73.386 70.807a5 5 0 0 0-4.97-.004L56.091 77.85c-3.357 1.92-3.357 6.762 0 8.682l12.325 7.047a5 5 0 0 0 4.97-.004l12.284-7.047c3.35-1.921 3.35-6.753 0-8.674l-12.284-7.047z'
      />
      <path
        stroke='currentColor'
        strokeWidth='1'
        d='M40.909 86.532c3.358-1.92 3.358-6.761 0-8.681l-12.325-7.047a5 5 0 0 0-4.97.003l-12.283 7.047c-3.35 1.922-3.35 6.753 0 8.674l12.284 7.047a5 5 0 0 0 4.97.004l12.325-7.047z'
      />
      <path
        stroke='currentColor'
        strokeWidth='1'
        d='M45.755 40.913a5 5 0 0 1 4.964 0l6.668 3.813a5 5 0 0 1 2.518 4.34v7.541a5 5 0 0 1-2.518 4.34l-6.668 3.813a5 5 0 0 1-4.964 0l-6.668-3.812a5 5 0 0 1-2.518-4.34v-7.542a5 5 0 0 1 2.518-4.34l6.668-3.813z'
      />
    </svg>
  )
}
