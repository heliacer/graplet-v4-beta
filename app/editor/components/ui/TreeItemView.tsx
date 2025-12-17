import {
  ItemInstance,
  SelectionDataRef,
  TreeInstance
} from '@headless-tree/core'
import { IconT, ItemIcon } from '../../lib/utils/icons'
import clsx from 'clsx'
import { isInternalObject } from '../../lib/utils/sobject3d'
import { useEditor } from '../../lib/EditorContext'
import { ChevronDown, ChevronRight, Eye, EyeClosed } from 'lucide-react'

export interface TreeItem {
  id: number
  name: string
  type: IconT
  hasChildren: boolean
}

interface ItemViewProps {
  tree: TreeInstance<TreeItem>
  item: ItemInstance<TreeItem>
}

function RenamingItemView({ item }: ItemViewProps) {
  return (
    <div className="flex w-full">
      <div style={{ marginLeft: `${item.getItemMeta().level * 8 + 12}px` }} />
      <div className="flex items-center w-full px-1 gap-1 rounded-l-md border border-teal-600 bg-zinc-800">
        <ItemIcon size={14} iconType={item.getItemData().type} />
        <input className="outline-0" {...item.getRenameInputProps()} />
      </div>
    </div>
  )
}

export function TreeItemView({ tree, item }: ItemViewProps) {
  const { scene, setContextMenu, setObjectVersion } = useEditor()

  const objectId = item.getItemData().id
  const object = scene.current.getObjectById(objectId)
  if (!object) return

  if (item.isRenaming()) return <RenamingItemView tree={tree} item={item} />

  return (
    <div className="flex w-full items-center">
      {item.isFolder() ? (
        <>
          {item.isExpanded() ? (
            <ChevronDown
              className="cursor-pointer text-zinc-400"
              onClick={item.collapse}
              size={12}
            />
          ) : (
            <ChevronRight
              className="cursor-pointer text-zinc-400"
              onClick={item.expand}
              size={12}
            />
          )}
          <div style={{ marginLeft: `${item.getItemMeta().level * 8}px` }} />
        </>
      ) : (
        <div style={{ marginLeft: `${item.getItemMeta().level * 8 + 12}px` }} />
      )}
      <div
        {...item.getProps()}
        onClick={(e) => {
          if (tree.getSelectedItems().includes(item)) {
            tree.setSelectedItems([])
          } else if (e.shiftKey) {
            item.selectUpTo(e.ctrlKey || e.metaKey)
          } else if (e.ctrlKey || e.metaKey) {
            item.toggleSelect()
          } else {
            tree.setSelectedItems([item.getId()])
          }

          if (!e.shiftKey) {
            tree.getDataRef<SelectionDataRef>().current.selectUpToAnchorId =
              item.getId()
          }
        }}
        onContextMenu={(e) => {
          e.preventDefault()
          if (isInternalObject(object)) return
          setContextMenu({ item, x: e.clientX, y: e.clientY })
        }}
        className={clsx(
          item.isSelected()
            ? 'border-teal-300/50 bg-teal-300/10'
            : 'border-transparent hover:bg-zinc-800 hover:border-zinc-650',
          'border w-full rounded-l-md px-1 focus:outline-none'
        )}
      >
        <div
          /* content */
          className={clsx(
            !object.visible && 'opacity-70',
            'flex w-full justify-between'
          )}
        >
          <div className="flex items-center gap-1">
            <ItemIcon size={14} iconType={item.getItemData().type} />
            {item.getItemName()}
          </div>
          <button
            className={clsx(
              item.isSelected() || !object.visible ? 'block' : 'hidden',
              'cursor-pointer'
            )}
            onClick={(e) => {
              e.stopPropagation()
              object.visible = !object.visible
              setObjectVersion((prev) => prev + 1)
            }}
          >
            {object.visible ? <Eye size={12} /> : <EyeClosed size={12} />}
          </button>
        </div>
      </div>
    </div>
  )
}
