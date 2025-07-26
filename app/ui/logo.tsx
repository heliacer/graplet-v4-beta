interface LogoProps {
  size: number
  className?: string
  id?: string
}

export default function Logo({
  size,
  className,
}: LogoProps) {
  return (
    <svg className={className} fill="none" width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="m52.837 22.748c0 1.4084 0.7332 2.7098 1.9233 3.4141l15.882 9.3969c2.5666 1.5186 5.7742-0.3825 5.77-3.4197l-0.0265-18.8c-2e-3 -1.4054-0.7338-2.7034-1.9209-3.407l-15.855-9.397c-2.5645-1.5199-5.7724 0.37665-5.7724 3.4126v18.8z" fill="url(#b)" />
      <path d="m82.191 42.392c-2.5644-1.5173-5.7699 0.3794-5.7699 3.414v18.805c0 1.4084 0.7332 2.7099 1.9233 3.4141l15.832 9.3675c2.5601 1.5148 5.7614-0.3731 5.7699-3.4026l0.0532-18.774c4e-3 -1.4125-0.7297-2.7192-1.9234-3.4255l-15.885-9.3989z" fill="url(#a)" />
      <path d="m23.588 32.139c-0.0042 3.0372 3.2034 4.9383 5.77 3.4197l15.882-9.3969c1.1902-0.7043 1.9233-2.0057 1.9233-3.4141v-18.8c0-3.036-3.2079-4.9325-5.7724-3.4126l-15.855 9.397c-1.1871 0.70356-1.9189 2.0016-1.9209 3.407l-0.0265 18.8z" fill="url(#b)" />
      <path d="m21.655 68.026c1.1901-0.7041 1.9233-2.0055 1.9233-3.4139l6e-4 -18.805c1e-4 -3.0347-3.2054-4.9315-5.7699-3.4141l-15.885 9.3988c-1.1937 0.7063-1.9274 2.0131-1.9234 3.4256l0.053429 18.774c0.0086221 3.0295 3.2098 4.9173 5.77 3.4025l15.831-9.3673z" fill="url(#a)" />
      <path d="m75.51 73.845c-1.1909-0.707-2.6596-0.7081-3.8515-0.0029l-15.888 9.4008c-2.5644 1.5174-2.5644 5.3107 0 6.8281l15.888 9.4007c1.1919 0.7052 2.6606 0.7042 3.8515-0.0028l15.835-9.4008c2.5581-1.5186 2.5581-5.3037 0-6.8223l-15.835-9.4008z" fill="url(#e)" />
      <path d="m44.23 90.071c2.5645-1.5173 2.5645-5.3108 0-6.8281l-15.889-9.4008c-1.1919-0.7052-2.6606-0.7041-3.8515 0.0029l-15.834 9.4008c-2.558 1.5186-2.5579 5.3037 3e-5 6.8223l15.835 9.4008c1.1909 0.707 2.6596 0.708 3.8515 0.0029l15.888-9.4008z" fill="url(#d)" />
      <path d="m47.799 41.279c1.1902-0.7042 2.6565-0.7042 3.8467 0l8.4369 4.992c1.1902 0.7042 1.9234 2.0056 1.9234 3.4141v9.9841c0 1.4084-0.7332 2.7098-1.9234 3.414l-8.4369 4.9921c-1.1902 0.7042-2.6565 0.7042-3.8467 0l-8.4369-4.9921c-1.1902-0.7042-1.9233-2.0056-1.9233-3.414v-9.9841c0-1.4085 0.7331-2.7099 1.9233-3.4141l8.4369-4.992z" fill="url(#c)" />
      <defs>
        <linearGradient id="b" x1="50" x2="50" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#139F86" offset="0" />
          <stop stopColor="#389F4B" offset="1" />
        </linearGradient>
        <linearGradient id="a" x1="50" x2="50" y1="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#139F86" offset="0" />
          <stop stopColor="#389F4B" offset="1" />
        </linearGradient>
        <linearGradient id="e" x1="100" x2="0" y1="50" y2="50" gradientUnits="userSpaceOnUse">
          <stop stopColor="#139F86" offset="0" />
          <stop stopColor="#389F4B" offset="1" />
        </linearGradient>
        <linearGradient id="d" x2="100" y1="50" y2="50" gradientUnits="userSpaceOnUse">
          <stop stopColor="#139F86" offset="0" />
          <stop stopColor="#389F4B" offset="1" />
        </linearGradient>
        <linearGradient id="c" x1="49.723" x2="49.723" y1="40.141" y2="69.214" gradientUnits="userSpaceOnUse">
          <stop stopColor="#389F4B" offset="0" />
          <stop stopColor="#139F86" offset="1" />
        </linearGradient>
      </defs>
    </svg>
  )
}