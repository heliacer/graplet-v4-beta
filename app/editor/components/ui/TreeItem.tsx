import { ItemInstance } from "@headless-tree/core"
import { IconT, ItemIcon } from "../../lib/utils/icons"
import clsx from "clsx"
import { isInternalObject } from "../../lib/utils/sobject3d"
import { useEditor } from "../../lib/EditorContext"
import { ChevronDown, ChevronRight, Eye, EyeClosed } from "lucide-react"

export interface TreeItem {
  id: number
  name: string
  type: IconT
  hasChildren: boolean
}

export function TreeItem({ item }: { item: ItemInstance<TreeItem> }) {
  const { scene, setContextMenu, setObjectVersion } = useEditor()

  const objectId = item.getItemData().id
  const object = scene.current.getObjectById(objectId)
  if (!object) throw Error(`Object with id ${objectId} does not exist`)

  return (
    <>
      {item.isRenaming() ? (
        <div className="flex w-full">
          <div
            style={{ marginLeft: `${item.getItemMeta().level * 8}px` }}
          />
          <div className="flex items-center w-full px-1 gap-1 rounded-l border border-teal-600 bg-zinc-800">
            <ItemIcon size={14} iconType={item.getItemData().type} />
            <input className="outline-0" {...item.getRenameInputProps()} />
          </div>
        </div>
      ) : (
        <div
          className="flex w-full"
          onContextMenu={(e: React.MouseEvent) => {
            e.preventDefault()
            if (isInternalObject(object)) return
            setContextMenu({ item, x: e.clientX, y: e.clientY })
          }}
        >
          <div
            style={{ marginLeft: `${item.getItemMeta().level * 8}px` }}
          />
          <div
            className={clsx(
              'w-full border-l rounded-l',
              item.isSelected()
                ? 'border-teal-600 bg-zinc-800'
                : 'hover:border-zinc-700 hover:bg-zinc-800 border-transparent'
            )}
            {...item.getProps()}
            key={item.getId()}
          >
            <div
              className={clsx(
                'flex flex-start pl-1 items-center gap-1',
                'border-l-0 border rounded-l',
                item.isSelected()
                  ? 'border-zinc-700'
                  : 'hover:border-zinc-700 border-transparent'
              )}
            >
              <ItemIcon size={14} iconType={item.getItemData().type} />
              {item.getItemName()}
              {item.isFolder() ? (
                item.isExpanded() ? (
                  <ChevronDown size={12} />
                ) : (
                  <ChevronRight size={12} />
                )
              ) : null}
              <button
                className={clsx(
                  item.isSelected() ? 'block' : 'hidden',
                  'cursor-pointer'

                )}
                onClick={(e) => {
                  e.stopPropagation()
                  object.visible = !object.visible
                  setObjectVersion(prev => prev + 1)
                }}
              >
                {object.visible ? <Eye size={12} /> : <EyeClosed size={12} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}