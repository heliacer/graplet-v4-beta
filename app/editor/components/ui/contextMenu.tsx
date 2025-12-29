import { Group, Layers2, LucideIcon, Pen, Trash } from 'lucide-react'
import { useEditor } from '../../lib/EditorContext'
import { useObjectActions } from '../../lib/hooks/useObjectActions'
import clsx from 'clsx'
import { moveObject } from '../../lib/utils/three'
import { ParentError } from '../../lib/types'

interface ContextMenuItemProps {
  label: string
  Icon: LucideIcon
  onClick: React.MouseEventHandler
}

function ContexMenuItem({ label, Icon, onClick }: ContextMenuItemProps) {
  return (
    <button
      className={clsx(
        'flex items-center gap-1 w-full border border-transparent px-0.5 rounded',
        'hover:border-ui-600 hover:bg-ui-700'
      )}
      onClick={onClick}
    >
      <Icon size={12} />
      <p>{label}</p>
    </button>
  )
}

export function ContextMenu() {
  const { scene, contextMenu, setContextMenu } = useEditor()
  const { deleteObject, duplicateObject, addObject } = useObjectActions()
  if (!contextMenu) return

  return (
    <div
      style={{ top: contextMenu.y, left: contextMenu.x }}
      className='absolute shadow-md min-w-20 bg-ui-800 border border-ui-700 p-0.5 text-xs rounded-md'
    >
      <ContexMenuItem
        label='Rename'
        Icon={Pen}
        onClick={() => {
          contextMenu.item.startRenaming()
          setContextMenu(null)
        }}
      />
      <ContexMenuItem
        label='Duplicate'
        Icon={Layers2}
        onClick={() => {
          const objectId = contextMenu.item.getItemData().id
          const object = scene.current.getObjectById(objectId)
          if (!object) throw Error(`Object with id ${objectId} does not exist`)
          duplicateObject(object)
          setContextMenu(null)
        }}
      />
      <ContexMenuItem
        label='Group'
        Icon={Group}
        onClick={() => {
          const objectId = contextMenu.item.getItemData().id
          const object = scene.current.getObjectById(objectId)
          if (!object) throw Error(`Object with id ${objectId} does not exist`)
          const parent = object.parent
          if (!parent) throw new ParentError(object)
          const target = addObject({ type: 'Group', name: 'Group' }, parent)
          moveObject(object, target)
          setContextMenu(null)
        }}
      />
      {/** @todo add Ungroup */}
      <ContexMenuItem
        label='Delete'
        Icon={Trash}
        onClick={() => {
          const objectId = contextMenu.item.getItemData().id
          const object = scene.current.getObjectById(objectId)
          if (!object) throw Error(`Object with id ${objectId} does not exist`)
          deleteObject(object)
          setContextMenu(null)
        }}
      />
    </div>
  )
}
