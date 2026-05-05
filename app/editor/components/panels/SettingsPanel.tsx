import clsx from 'clsx'
import { MiniGraplet } from '@/app/ui/assets/MiniGraplet'
import { useEditorStore } from '../../state'
import { useEditorRefs } from '../../context/editor'
import { defaultLayout } from '../defaultDockview'

interface ThemeButtonProps {
  theme: string
}

function ThemeButton({ theme }: ThemeButtonProps) {
  const currentTheme = useEditorStore(s => s.currentTheme)
  const setCurrentTheme = useEditorStore(s => s.setCurrentTheme)

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
  const { workspace } = useEditorRefs()
  const autoClose = useEditorStore(s => s.autoClose)
  const dvApi = useEditorStore(s => s.dvApi)
  const setAutoClose = useEditorStore(s => s.setAutoClose)

  function handleLoadDefaultDockview() {
    if (!dvApi) return
    dvApi.fromJSON(defaultLayout)
  }

  return (
    <div className='flex items-start flex-col gap-2 m-4 text-sm'>
      <p>Theme</p>
      <p className='italic text-ui-400'>More themes are coming soon!</p>
      <div className='flex flex-wrap gap-2'>
        <ThemeButton theme='dark' />
        <ThemeButton theme='light' />
      </div>
      <p>Toolbox</p>
      <label className='flex gap-2 select-none cursor-pointer'>
        <input
          type='checkbox'
          checked={autoClose}
          onChange={e => {
            setAutoClose(e.target.checked)
            const flyout = workspace.current?.getFlyout()
            if (flyout) {
              flyout.autoClose = e.target.checked
            }
          }}
        />
        <p>Autoclose the toolbox</p>
      </label>
      <p>Actions</p>
      <button
        className={clsx(
          'flex gap-1 px-1 items-center',
          'border rounded-md',
          'border-ui-700',
          'hover:bg-ui-750 bg-ui-800'
        )}
        onClick={handleLoadDefaultDockview}
      >
        <p>Reset dockview layout</p>
      </button>
    </div>
  )
}
