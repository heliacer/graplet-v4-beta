import { useEditorRefs } from '../../context'
import { useEditorStore } from '../../state'
import { EditMenu } from './menus/edit'
import { FileMenu } from './menus/file'
import clsx from 'clsx'

const lorem = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
`
export function NavMenu() {
  const { workspace } = useEditorRefs()
  const notifications = useEditorStore(s => s.notifications)
  const setNotifications = useEditorStore(s => s.setNotifications)

  return (
    <nav className='w-full h-full flex items-center gap-2'>
      <FileMenu />
      <EditMenu />
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
      <button
        className={clsx(
          'text-sm flex gap-1 px-1 items-center',
          'border rounded-md',
          'border-ui-700',
          'hover:bg-ui-750 bg-ui-800'
        )}
        onClick={() => {
          const flyout = workspace.current?.getFlyout()
          if (flyout) {
            flyout.autoClose = !flyout.autoClose
          }
        }}
      >
        pin/unpin flyout
      </button>
    </nav>
  )
}
