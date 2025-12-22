import clsx from 'clsx'

function ThemeButton({ theme }: { theme: string }) {
  return (
    <button
      className={clsx(
        'text-sm flex gap-1 px-1 items-center',
        'border rounded-md',
        'border-ui-700',
        'hover:bg-ui-750 bg-ui-800'
      )}
      onClick={() => {
        document.documentElement.className = theme
        fetch('/api/cookie', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ theme })
        })
      }}
    >
      {theme}
    </button>
  )
}

export default function SettingsPanel() {
  return (
    <div className='m-4'>
      <p>Settings</p>
      <div className='flex gap-1'>
        <p>Theme</p>
        <ThemeButton theme='light' />
        <ThemeButton theme='dark' />
      </div>
    </div>
  )
}
