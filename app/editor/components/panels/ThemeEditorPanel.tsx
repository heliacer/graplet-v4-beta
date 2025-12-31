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
  const [isChanged, setIsChanged] = useState(false)
  const [colorValue, setColorValue] = useState<string>(() => {
    const c = getComputedStyle(document.documentElement)
      .getPropertyValue(variable)
      .trim()
    const hex = formatHex(c)
    if (!hex) throw Error(`unable to format ${c} from ${variable}`)
    return hex
  })

  const [debouncedColor, setDebouncedColor] = useState(colorValue)

  useEffect(() => {
    const c = getComputedStyle(document.documentElement)
      .getPropertyValue(variable)
      .trim()
    const hex = formatHex(c)
    if (!hex) throw Error(`unable to format ${c} from ${variable}`)
    setColorValue(hex)
    setIsChanged(false)
  }, [currentTheme, resetVersion, variable])

  useEffect(() => {
    const handle = setTimeout(() => {
      document.documentElement.style.setProperty(variable, debouncedColor)
    }, 5)
    return () => clearTimeout(handle)
  }, [debouncedColor, variable])

  return (
    <label
      htmlFor={colorName}
      className={clsx(
        'cursor-pointer flex text-sm border px-0.5 rounded-md',
        'hover:bg-ui-800',
        isChanged ? 'border-teal' : 'border-ui-700'
      )}
    >
      <input
        id={colorName}
        className='w-5 h-5 cursor-pointer'
        type='color'
        value={colorValue}
        onChange={e => {
          const newColor = e.target.value
          setColorValue(newColor)
          setDebouncedColor(newColor)
          setIsChanged(true)
        }}
      />
      {colorName}
    </label>
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
    <div className='flex h-full'>

      <div className='flex p-2 gap-4 h-full border-r border-ui-700'>
        <div className='flex flex-col gap-1'>
          <p>UI Colors</p>
          {[...Array(19)].map((_, key) => (
            <ColorPicker
              key={key}
              colorName={`ui-${(key + 1) * 50}`}
              resetVersion={resetVersion}
            />
          ))}
        </div>
        <div className='flex flex-col gap-1'>
          <p>Accent Colors</p>
          {accentColors.map((accentColor, key) => (
            <ColorPicker
              key={key}
              colorName={accentColor}
              resetVersion={resetVersion}
            />
          ))}
        </div>
      </div>


      <div className='p-2 flex flex-col gap-1'>
        <div className='flex flex-col gap-1'>
          {/** @todo make this a "theme" switcher aswell */}
          <p>base: {currentTheme}</p>
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
    </div>
  )
}
