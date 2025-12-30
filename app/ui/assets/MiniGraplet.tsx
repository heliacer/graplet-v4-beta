interface LogoSolidProps {
  size?: number
}

/**
 * @todo Extend theme variables to always hold a reference to each theme,
 * e.g var(--color-dark-ui-900) and the global (current) is var(--color-ui-900)
 *
 * this allows for multi-assignment with the same svg, e.g `var(--color-${theme}-ui-900)`
 *
 * -> themes/ dark.css | ...
 */

export default function MiniGraplet({ size = 160 }: LogoSolidProps) {
  const bgColor1 = 'var(--color-ui-900)'
  const bgColor2 = 'var(--color-ui-850)'
  const bgColor3 = 'var(--color-ui-800)'
  const bgColor4 = 'var(--color-ui-700)'

  const blue = 'var(--color-blue)'
  const orange = 'var(--color-orange)'
  const teal = 'var(--color-teal)'
  const cyan = 'var(--color-cyan)'
  const purple = 'var(--color-purple)'
  const red = 'var(--color-red)'
  const rose = 'var(--color-rose)'
  const amber = 'var(--color-amber)'
  const green = 'var(--color-green)'
  const indigo = 'var(--color-indigo)'
  const mint = 'var(--color-mint)'
  const copper = 'var(--color-copper)'

  return (
    <svg width={size} viewBox='0 0 160 104'>
      <rect width='160' height='104' rx='4' fill={bgColor1} />
      <g clipPath='url(#clip0_1488_1717)'>
        <circle cx='6' cy='6' r='2' fill={teal} />
        <rect x='22' y='4' width='36' height='4' rx='2' fill={bgColor3} />
        <rect x='72' y='4' width='14' height='4' rx='2' fill={teal} />
        <rect x='100' y='4' width='56' height='4' rx='2' fill={bgColor3} />
      </g>
      <g clipPath='url(#clip1_1488_1717)'>
        <rect x='4' y='11' width='152' height='89' rx='4' fill={bgColor2} />
        <circle cx='9' cy='16' r='2' fill={blue} />
        <circle cx='9' cy='23' r='2' fill={orange} />
        <circle cx='9' cy='30' r='2' fill={teal} />
        <circle cx='9' cy='37' r='2' fill={cyan} />
        <circle cx='9' cy='44' r='2' fill={purple} />
        <circle cx='9' cy='51' r='2' fill={red} />
        <circle cx='9' cy='58' r='2' fill={rose} />
        <circle cx='9' cy='65' r='2' fill={amber} />
        <circle cx='9' cy='72' r='2' fill={green} />
        <circle cx='9' cy='79' r='2' fill={indigo} />
        <circle cx='9' cy='86' r='2' fill={mint} />
        <circle cx='9' cy='93' r='2' fill={copper} />
        <rect
          width='61'
          height='85'
          transform='translate(16 13)'
          fill='url(#pattern0_1488_1717)'
        />
        <rect x='82' y='14' width='71' height='40' rx='2' fill={bgColor3} />
        <g opacity='0.8'>
          <path
            d='M112.562 32.5345C112.884 31.6639 114.116 31.6639 114.438 32.5345L115.501 35.408C115.602 35.6818 115.818 35.8976 116.092 35.9988L118.965 37.0621C119.836 37.3843 119.836 38.6157 118.965 38.9379L116.092 40.0012C115.818 40.1024 115.602 40.3182 115.501 40.592L114.438 43.4655C114.116 44.3361 112.884 44.3361 112.562 43.4655L111.499 40.592C111.398 40.3182 111.182 40.1024 110.908 40.0012L108.035 38.9379C107.164 38.6157 107.164 37.3843 108.035 37.0621L110.908 35.9988C111.182 35.8976 111.398 35.6818 111.499 35.408L112.562 32.5345Z'
            fill={teal}
          />
          <path
            d='M123.062 24.5345C123.384 23.6639 124.616 23.6639 124.938 24.5345L125.326 25.5833C125.427 25.857 125.643 26.0728 125.917 26.1741L126.965 26.5621C127.836 26.8843 127.836 28.1157 126.965 28.4379L125.917 28.8259C125.643 28.9272 125.427 29.143 125.326 29.4167L124.938 30.4655C124.616 31.3361 123.384 31.3361 123.062 30.4655L122.674 29.4167C122.573 29.143 122.357 28.9272 122.083 28.8259L121.035 28.4379C120.164 28.1157 120.164 26.8843 121.035 26.5621L122.083 26.1741C122.357 26.0728 122.573 25.857 122.674 25.5833L123.062 24.5345Z'
            fill={teal}
          />
        </g>
        <g clipPath='url(#clip2_1488_1717)'>
          <rect x='82' y='57' width='11' height='11' rx='1' fill={bgColor3} />
          <rect x='97' y='57' width='11' height='11' rx='1' fill={bgColor3} />
          <rect x='112' y='57' width='11' height='11' rx='1' fill={bgColor3} />
          <rect x='127' y='57' width='11' height='11' rx='1' fill={bgColor3} />
          <rect x='142' y='57' width='11' height='11' rx='1' fill={bgColor3} />
          <rect x='82' y='72' width='11' height='11' rx='1' fill={bgColor3} />
          <rect x='97' y='72' width='11' height='11' rx='1' fill={bgColor3} />
          <rect x='112' y='72' width='11' height='11' rx='1' fill={bgColor3} />
          <rect x='127' y='72' width='11' height='11' rx='1' fill={bgColor3} />
          <rect x='142' y='72' width='11' height='11' rx='1' fill={bgColor3} />
          <rect x='82' y='87' width='11' height='11' rx='1' fill={bgColor3} />
          <rect x='97' y='87' width='11' height='11' rx='1' fill={bgColor3} />
        </g>
      </g>
      <defs>
        <clipPath id='clip0_1488_1717'>
          <rect
            width='152'
            height='4'
            fill='white'
            transform='translate(4 4)'
          />
        </clipPath>
        <clipPath id='clip1_1488_1717'>
          <rect x='4' y='11' width='152' height='89' rx='4' fill='white' />
        </clipPath>
        <clipPath id='clip2_1488_1717'>
          <rect
            width='71'
            height='40'
            fill='white'
            transform='translate(82 57)'
          />
        </clipPath>
        <pattern
          id='pattern0_1488_1717'
          patternUnits='userSpaceOnUse'
          patternTransform='matrix(4 0 0 4 0 0)'
          preserveAspectRatio='none'
          viewBox='0 0 4 4'
          width='1'
          height='1'
        >
          <g id='pattern0_1488_1717_inner'>
            <rect width='1' height='1' fill={bgColor4} />
          </g>
        </pattern>
      </defs>
    </svg>
  )
}
