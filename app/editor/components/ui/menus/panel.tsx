import { useEditor } from '@/app/editor/lib/EditorContext'
import { IconT } from '@/app/editor/lib/types'
import { upsertPanel } from '@/app/editor/lib/utils/dockview'
import { ItemIcon } from '@/app/editor/lib/utils/icons'
import clsx from 'clsx'

interface PanelMenuProps {
  component: string
  title: string
  iconType: IconT
}

export function PanelMenu({ component, title, iconType }: PanelMenuProps) {
  const { dvApi } = useEditor()
  if (!dvApi) return

  return (
    <button
      onClick={() => upsertPanel(dvApi, component, title, iconType)}
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
