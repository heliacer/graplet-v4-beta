import { formatHex } from 'culori'
import { useEffect, useState } from 'react'
import { useEditor } from '../../lib/EditorContext'
import clsx from 'clsx'

function ColorPicker({
  colorName,
  resetVersion
}: {
  colorName: string
  resetVersion: number
}) {
  const { currentTheme } = useEditor()

  const variable = `--${colorName}`
  const [colorValue, setColorValue] = useState(() => {
    const c = getComputedStyle(document.documentElement)
      .getPropertyValue(variable)
      .trim()
    return formatHex(c)
  })

  useEffect(() => {
    const cssColor = getComputedStyle(document.documentElement)
      .getPropertyValue(variable)
      .trim()
    setColorValue(formatHex(cssColor))
  }, [currentTheme, resetVersion, variable])

  return (
    /** @todo Will improve UX, with actual color inputs who can be clicked not just like this */
    <div className='flex'>
      <input
        id={colorName}
        className='w-6 h-6 cursor-pointer'
        type='color'
        value={colorValue}
        onChange={(e) => {
          const newColor = e.target.value
          setColorValue(newColor)
          document.documentElement.style.setProperty(variable, newColor)
        }}
      />
      <label htmlFor={colorName} className='cursor-pointer'>
        {colorName}
      </label>
    </div>
  )
}

/**
 * @todo Export as CSS -> ready to implement
 */
export default function ThemeEditorPanel() {
  const [resetVersion, setResetVersion] = useState(0)
  const { currentTheme } = useEditor()

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
    <div className='flex gap-4 m-2'>
      <div className='flex flex-col gap-0.5'>
        <p>UI Colors</p>
        {[...Array(19)].map((_, key) => (
          <ColorPicker
            key={key}
            colorName={`ui-${(key + 1) * 50}`}
            resetVersion={resetVersion}
          />
        ))}
      </div>
      <div className='flex flex-col gap-0.5'>
        <p>Accent Colors</p>
        {accentColors.map((accentColor, key) => (
          <ColorPicker
            key={key}
            colorName={accentColor}
            resetVersion={resetVersion}
          />
        ))}
      </div>
      <div>
        <p>Base Theme: {currentTheme}</p>
        <button
          className={clsx(
            'text-sm flex gap-1 px-1 items-center',
            'border rounded-md',
            'border-ui-700',
            'hover:bg-ui-750 bg-ui-800'
          )}
          onClick={() => {
            document.documentElement.removeAttribute('style')
            setResetVersion((v) => v + 1)
          }}
        >
          Reset Colors
        </button>
      </div>
    </div>
  )
}
