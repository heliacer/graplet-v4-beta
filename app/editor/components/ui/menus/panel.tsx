import { useEditor } from '@/app/editor/lib/EditorContext'
import { IconT } from '@/app/editor/lib/types'
import { ItemIcon } from '@/app/editor/lib/utils/icons'
import clsx from 'clsx'

interface PanelMenuProps {
  component: string
  title: string
  iconType: IconT
}

export function PanelMenu({ component, title, iconType }: PanelMenuProps) {
  const { dvApi } = useEditor()

  return (
    <button
      onClick={() => {
        const panel = dvApi?.getPanel(component)
        if (panel) {
          panel.api.setActive()
        } else {
          dvApi?.addPanel({
            id: component,
            component,
            title,
            params: {
              iconType,
              closable: true
            },
            floating: {
              x: document.body.clientWidth / 2 - 450,
              y: document.body.clientHeight / 2 - 320,
              width: 900,
              height: 550
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
      <ItemIcon iconType={iconType} size={14} />
      <p>{title}</p>
    </button>
  )
}
