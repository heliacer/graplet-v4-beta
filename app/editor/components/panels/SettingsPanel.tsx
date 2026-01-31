import clsx from 'clsx'
import { MiniGraplet } from '@/app/ui/assets/MiniGraplet'
import { useEditor } from '../../lib/EditorContext'

interface ThemeButtonProps {
  theme: string
}

function ThemeButton({ theme }: ThemeButtonProps) {
  const { currentTheme, setCurrentTheme } = useEditor()
  function handleClick() {
    document.documentElement.className = theme
    setCurrentTheme(theme)
    fetch('/api/cookie', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme })
    })
  }

  return (
    <button
      className={clsx(
        'border rounded-md cursor-pointer',
        theme === currentTheme
          ? 'border-teal'
          : 'border-ui-700 hover:border-teal'
      )}
      onClick={handleClick}
    >
      <MiniGraplet className={`${theme} m-0.5`} />
      <p>{theme}</p>
    </button>
  )
}

export default function SettingsPanel() {
  /** @todo Make available themes more flexible, maybe save them in a state */
  const themeNames = ['dark', 'light', 'arctic', 'lime', 'red']

  return (
    <div className='flex flex-col gap-1 m-4 text-sm'>
      <p>Theme</p>
      <div className='flex gap-2'>
        {themeNames.map((theme, key) => (
          <ThemeButton key={key} theme={theme} />
        ))}
      </div>
    </div>
  )
}
