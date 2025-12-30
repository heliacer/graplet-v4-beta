import { formatHex } from 'culori'

function ColorPicker({ colorName }: { colorName: string }) {
  const color = getComputedStyle(document.documentElement)
    .getPropertyValue(`--${colorName}`)
    .trim()

  /** @todo Come up with a smart way to apply css variables, and not disturb the current applied theme (create a new theme ?) */

  return (
    /** @todo Will improve UX, with actual color inputs who can be clicked not just like this */
    <div className='flex'>
      <input
        id={colorName}
        className='w-6 h-6 cursor-pointer'
        type='color'
        value={formatHex(color)}
        readOnly
      />
      <label htmlFor={colorName} className='cursor-pointer'>
        {colorName}
      </label>
    </div>
  )
}

export default function ThemeEditorPanel() {
  const accentColors = [
    'blue',
    'orange',
    'teal',
    'cyan',
    'purple',
    'red',
    'rose',
    'amber',
    'green',
    'indigo',
    'mint',
    'copper'
  ]

  return (
    <div className='flex gap-2'>
      <div className='flex flex-col gap-0.5 m-2'>
        <p>UI Colors</p>
        {[...Array(19)].map((_, key) => (
          <ColorPicker key={key} colorName={`ui-${(key + 1) * 50}`} />
        ))}
      </div>
      <div className='flex flex-col gap-0.5 m-2'>
        <p>Accent Colors</p>
        {accentColors.map((accentColor, key) => (
          <ColorPicker key={key} colorName={accentColor} />
        ))}
      </div>
    </div>
  )
}
