import { useEditor } from '@/app/editor/lib/EditorContext'
import clsx from 'clsx'
import { Settings2 } from 'lucide-react'

export function SettingsMenu() {
  const { dvApi } = useEditor()

  return (
    <button
      onClick={() => {
        const panel = dvApi?.getPanel('settings')
        if (panel) {
          panel.api.setActive()
        } else {
          dvApi?.addPanel({
            id: 'settings',
            component: 'settings',
            title: 'Settings',
            params: {
              iconType: 'Settings2',
              closable: true
            }
          })
        }
      }}
      className={clsx(
        'text-sm flex gap-1 px-1 items-center',
        'border rounded-md',
        'border-ui-700',
        'hover:bg-ui-750 bg-ui-800'
      )}
    >
      <Settings2 size={14} />
      <p>Settings</p>
    </button>
  )
}
