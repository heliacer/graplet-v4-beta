import clsx from 'clsx'
import { MiniGraplet } from '@/app/ui/assets/MiniGraplet'
import { useState } from 'react'

interface ThemeButtonProps {
  theme: string
  currentTheme: string
  setCurrentTheme: React.Dispatch<React.SetStateAction<string>>
}

function ThemeButton({
  theme,
  currentTheme,
  setCurrentTheme
}: ThemeButtonProps) {
  const handleClick = () => {
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
        'border rounded-md cursor-pointer transition-colors',
        theme === currentTheme
          ? 'border-teal'
          : 'border-ui-700 hover:border-teal'
      )}
      onClick={handleClick}
    >
      <MiniGraplet className={`${theme} m-0.5`} />
    </button>
  )
}

export default function SettingsPanel() {
  const [currentTheme, setCurrentTheme] = useState(
    document.documentElement.className
  )

  /** @todo Make available themes more flexible, maybe save them in a state */
  const themes = ['dark', 'light']

  return (
    <div className='flex flex-col gap-2 m-4'>
      <p>Theme</p>
      <div className='flex gap-2'>
        {themes.map((theme, key) => (
          <ThemeButton
            key={key}
            theme={theme}
            currentTheme={currentTheme}
            setCurrentTheme={setCurrentTheme}
          />
        ))}
      </div>
    </div>
  )
}
