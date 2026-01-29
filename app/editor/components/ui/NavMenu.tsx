import clsx from 'clsx'
import { EditMenu } from './menus/edit'
import { FileMenu } from './menus/file'
import { PanelMenu } from './menus/panel'
import { useEditor } from '../../lib/EditorContext'

const lorem = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
`

export function NavMenu() {
  const { notifications, setNotifications, workspace } = useEditor()

  return (
    <nav className='w-full h-full flex items-center gap-2'>
      <PanelMenu component='settings' title='Settings' iconType='Settings2' />
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
        trigger notification!
      </button>
      <button
        className={clsx(
          'text-sm flex gap-1 px-1 items-center',
          'border rounded-md',
          'border-ui-700',
          'hover:bg-ui-750 bg-ui-800'
        )}
        onClick={() => {
          const flyout = workspace?.getFlyout()
          if (flyout) {
            flyout.autoClose = !flyout.autoClose
          }
        }}
      >
        toggle flyout autoclose!
      </button>
    </nav>
  )
}
