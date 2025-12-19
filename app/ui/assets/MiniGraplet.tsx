interface LogoSolidProps {
  size: number
  className?: string
}

export default function MiniGraplet({ size, className }: LogoSolidProps) {
  /** @todo color palette parts - FIND A GOOD WAY TO STREAMLINE !!! (theme managing / colors etc) */
  const bgColor1 = '#18181B' // 900 : 100 F4F4F5
  const bgColor2 = '#202022' // 850 : 200 E4E4E7
  const bgColor3 = '#27272A' // 800 : 300 D4D4D8
  const bgColor4 = '#3F3F46' // 700 : 400 A1A1AA

  /** all colors */
  const blue = '#4565B7' // 557EE8 Dark Blue
  const orange = '#C58320' // 956215 Dark Orange
  const teal = '#139F86' // 128571 Dark Teal
  const cyan = '#41A5D8' // 3587B1 Dark Cyan
  const purple = '#834CD3' // 6937B1 Dark Purple
  const red = '#C2524C' // 923530 Dark Red
  const rose = '#C55FCF' // 9D49A6 Dark Rose
  const amber = '#D79B3E' // B67F30 Dark Amber
  const green = '#7EBF41' // 5D8F2D Dark Green
  const indigo = '#5B5FCF' // 3E429C Dark Indigo
  const mint = '#4FB0C1' // 3C8794 Dark Mint
  const copper = '#C57C41' // 955B2C Dark Copper

  return (
    <>
      <svg
        width={size}
        className={className}
        viewBox='0 0 160 104'
        xmlns='http://www.w3.org/2000/svg'
      >
        <rect width='160' height='104' rx='4' fill={bgColor1} />
        <g clip-path='url(#d)'>
          <circle cx='6' cy='6' r='2' fill={teal} />
          <rect x='22' y='4' width='36' height='4' rx='2' fill={bgColor3} />
          <rect x='72' y='4' width='14' height='4' rx='2' fill={teal} />
          <rect x='100' y='4' width='56' height='4' rx='2' fill={bgColor3} />
        </g>
        <g clip-path='url(#c)'>
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
            transform='translate(16 13)'
            width='61'
            height='85'
            fill='url(#a)'
          />
          <rect x='82' y='14' width='71' height='40' rx='2' fill={bgColor3} />
          <g fill='#128571' opacity='.8'>
            <path d='m112.56 32.534c0.322-0.8706 1.554-0.8706 1.876 0l1.063 2.8735c0.101 0.2738 0.317 0.4896 0.591 0.5908l2.873 1.0633c0.871 0.3222 0.871 1.5536 0 1.8758l-2.873 1.0633c-0.274 0.1012-0.49 0.317-0.591 0.5908l-1.063 2.8735c-0.322 0.8706-1.554 0.8706-1.876 0l-1.063-2.8735c-0.101-0.2738-0.317-0.4896-0.591-0.5908l-2.873-1.0633c-0.871-0.3222-0.871-1.5536 0-1.8758l2.873-1.0633c0.274-0.1012 0.49-0.317 0.591-0.5908l1.063-2.8735z' />
            <path d='m123.06 24.534c0.322-0.8706 1.554-0.8706 1.876 0l0.388 1.0488c0.101 0.2737 0.317 0.4895 0.591 0.5908l1.048 0.388c0.871 0.3222 0.871 1.5536 0 1.8758l-1.048 0.388c-0.274 0.1013-0.49 0.3171-0.591 0.5908l-0.388 1.0488c-0.322 0.8706-1.554 0.8706-1.876 0l-0.388-1.0488c-0.101-0.2737-0.317-0.4895-0.591-0.5908l-1.048-0.388c-0.871-0.3222-0.871-1.5536 0-1.8758l1.048-0.388c0.274-0.1013 0.49-0.3171 0.591-0.5908l0.388-1.0488z' />
          </g>
          <g clip-path='url(#b)' fill={bgColor3}>
            <rect x='82' y='57' width='11' height='11' rx='1' />
            <rect x='97' y='57' width='11' height='11' rx='1' />
            <rect x='112' y='57' width='11' height='11' rx='1' />
            <rect x='127' y='57' width='11' height='11' rx='1' />
            <rect x='142' y='57' width='11' height='11' rx='1' />
            <rect x='82' y='72' width='11' height='11' rx='1' />
            <rect x='97' y='72' width='11' height='11' rx='1' />
            <rect x='112' y='72' width='11' height='11' rx='1' />
            <rect x='127' y='72' width='11' height='11' rx='1' />
            <rect x='142' y='72' width='11' height='11' rx='1' />
            <rect x='82' y='87' width='11' height='11' rx='1' />
            <rect x='97' y='87' width='11' height='11' rx='1' />
          </g>
        </g>
        <defs>
          <clipPath id='d'>
            <rect
              transform='translate(4 4)'
              width='152'
              height='4'
              fill='#fff'
            />
          </clipPath>
          <clipPath id='c'>
            <rect x='4' y='11' width='152' height='89' rx='4' fill='#fff' />
          </clipPath>
          <clipPath id='b'>
            <rect
              transform='translate(82 57)'
              width='71'
              height='40'
              fill='#fff'
            />
          </clipPath>
          <pattern
            id='a'
            width='1'
            height='1'
            patternTransform='scale(4)'
            patternUnits='userSpaceOnUse'
            preserveAspectRatio='none'
            viewBox='0 0 4 4'
          >
            <rect width='1' height='1' fill={bgColor4} />
          </pattern>
        </defs>
      </svg>
    </>
  )
}
