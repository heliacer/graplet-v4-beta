import clsx from "clsx"

function KeybindItem({ label, keys }: { label: string, keys: string[] }) {
  return (
    <div className='flex items-center justify-between w-80'>
      <p>{label}</p>
      <code className={clsx(
        'px-1 rounded',
        'bg-ui-900 border border-ui-750'
      )}>
        {keys.map(k => k.toUpperCase()).join(' + ')}
      </code>
    </div>
  )

}

type Keybind = {
  kind: string
  keys: string[]
}

/**
 * @todo work in progress, peak
 */
export default function KeybindsPanel() {
  const sceneKeybinds: Keybind[] = [
    {
      kind: 'Copy Object',
      keys: ['crtl', 'c']
    },
    {
      kind: 'Paste Object',
      keys: ['crtl', 'v']
    },
    {
      kind: 'Cut Object',
      keys: ['crtl', 'x']
    },
    {
      kind: 'Group object',
      keys: ['crtl', 'g']
    },
    {
      kind: 'Duplicate Object',
      keys: ['crtl', 'd']
    }
  ]

  return (
    <div className='text-sm m-4 flex flex-col gap-1'>
      <KeybindItem label='Open keybinds' keys={['/']} />
      <p className='pt-1 text-base'>Scene</p>
      {sceneKeybinds.map(({ kind, keys }, key) => <KeybindItem key={key} label={kind} keys={keys} />)}
    </div>
  )
}
