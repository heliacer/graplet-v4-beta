import { Group, Layers2, LucideIcon, Pen, Trash, Ungroup } from 'lucide-react'
import { useEditor } from '../../lib/EditorContext'
import { useObjectActions } from '../../lib/hooks/useObjectActions'
import clsx from 'clsx'

interface ContextMenuItemProps {
  label: string
  Icon: LucideIcon
  onClick: React.MouseEventHandler
  disabled?: boolean
}

function ContexMenuItem({
  label,
  Icon,
  onClick,
  disabled
}: ContextMenuItemProps) {
  const { setContextMenu } = useEditor()

  return (
    <button
      className={clsx(
        'flex items-center gap-1 w-full border border-transparent px-0.5 rounded',
        disabled ? 'text-ui-400' : 'hover:border-ui-600 hover:bg-ui-700'
      )}
      onClick={(e) => {
        onClick(e)
        setContextMenu(null)
      }}
      disabled={disabled}
    >
      <Icon size={12} />
      <p>{label}</p>
    </button>
  )
}

export function ContextMenu() {
  const { scene, contextMenu } = useEditor()
  const { removeObject, duplicateObject, groupObject, unGroupObject } =
    useObjectActions()
  if (!contextMenu) return

  /**
   * @todo object specific, should have context menu for object (ObjectContextMenu),
   * and for empty tree rightclick (add object, ameer suggestion)
   */
  const objectId = contextMenu.item.getItemData().id
  const object = scene.current.getObjectById(objectId)
  if (!object) throw Error(`Object with id ${objectId} does not exist`)

  return (
    <div
      style={{ top: contextMenu.y, left: contextMenu.x }}
      className='absolute shadow-md min-w-20 bg-ui-800 border border-ui-700 p-0.5 text-xs rounded-md'
    >
      <ContexMenuItem
        label='Rename'
        Icon={Pen}
        onClick={() => contextMenu.item.startRenaming()}
      />
      <ContexMenuItem
        label='Duplicate'
        Icon={Layers2}
        onClick={() => duplicateObject(object)}
      />
      <ContexMenuItem
        label='Group'
        Icon={Group}
        onClick={() => groupObject(object)}
      />
      <ContexMenuItem
        label='Ungroup'
        disabled={object.children.length === 0}
        Icon={Ungroup}
        onClick={() => unGroupObject(object)}
      />
      <ContexMenuItem
        label='Delete'
        Icon={Trash}
        onClick={() => removeObject(object)}
      />
    </div>
  )
}
