import clsx from 'clsx'

function KeybindItem({ label, keys }: { label: string; keys: string[] }) {
  return (
    <div className='flex items-center justify-between w-80'>
      <p>{label}</p>
      <code className={clsx('px-1 rounded', 'bg-ui-900 border border-ui-750')}>
        {keys.map(k => k.toUpperCase()).join(' + ')}
      </code>
    </div>
  )
}

interface Keybind {
  label: string // e.g Copy Object, might need id or kind (copy-object)
  keys: string[] // e.g ['crtl', 'c']
}

/**
 * @todo work in progress, peak
 */
export default function KeybindsPanel() {
  const sceneKeybinds: Keybind[] = [
    {
      label: 'Copy Object',
      keys: ['crtl', 'c']
    },
    {
      label: 'Paste Object',
      keys: ['crtl', 'v']
    },
    {
      label: 'Cut Object',
      keys: ['crtl', 'x']
    },
    {
      label: 'Group object',
      keys: ['crtl', 'g']
    },
    {
      label: 'Duplicate Object',
      keys: ['crtl', 'd']
    }
  ]

  return (
    <div className='text-sm m-4 flex flex-col gap-1'>
      <KeybindItem label='Open keybinds' keys={['/']} />
      <p className='pt-1 text-base'>Scene</p>
      {sceneKeybinds.map(({ label, keys }, key) => (
        <KeybindItem key={key} label={label} keys={keys} />
      ))}
    </div>
  )
}
