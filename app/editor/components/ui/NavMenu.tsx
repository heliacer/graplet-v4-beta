import { DragNumberInput } from '@/app/ui/components/DragNumberInput'
import { useEditorStore } from '../../state'
import { EditMenu } from './menus/edit'
import { FileMenu } from './menus/file'
import clsx from 'clsx'
import { useEditorRefs } from '../../context/editor'
import { useState } from 'react'

const lorem = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
`
export function NavMenu() {
  const { stepsPerFrame } = useEditorRefs()
  const notifications = useEditorStore(s => s.notifications)
  const setNotifications = useEditorStore(s => s.setNotifications)
  const [spf, setSpf] = useState<number>(stepsPerFrame.current)

  return (
    <nav className='w-full h-full flex items-center gap-2'>
      <FileMenu />
      <EditMenu />
      <p className='text-sm italic'>devtools:</p>
      <button
        className={clsx(
          'text-sm flex gap-1 px-1 items-center',
          'border rounded-md',
          'border-ui-700',
          'hover:bg-ui-750 bg-ui-800'
        )}
        onClick={() => {
          setNotifications([
            ...notifications,
            {
              title: 'Hello',
              content: lorem
            }
          ])
        }}
      >
        notification!
      </button>
      <p className='text-sm italic'>steps per frame:</p>
      <DragNumberInput
        className='text-xs rounded border outline-none w-10 text-center'
        decimals={0}
        step={1}
        min={1}
        value={spf}
        onChange={v => {
          setSpf(v)
          stepsPerFrame.current = v
        }}
      />
    </nav>
  )
}
