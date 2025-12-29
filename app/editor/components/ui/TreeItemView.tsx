import { ItemInstance, TreeInstance } from '@headless-tree/core'
import { IconT, ItemIcon } from '../../lib/utils/icons'
import clsx from 'clsx'
import { useEditor } from '../../lib/EditorContext'
import { ChevronDown, ChevronRight, Eye, EyeClosed } from 'lucide-react'
import { useState } from 'react'
import { Object3D } from 'three'
import { isInternalObject } from '../../lib/utils/three'

export interface TreeItem {
  id: number
  name: string
  type: IconT
  hasChildren: boolean
}

function RenamingItemView({ item }: { item: ItemInstance<TreeItem> }) {
  return (
    <div className='flex w-full'>
      <div style={{ marginLeft: `${item.getItemMeta().level * 8 + 12}px` }} />
      <div className='flex items-center w-full px-1 gap-1 rounded-l-md border border-teal bg-ui-800'>
        <ItemIcon size={14} iconType={item.getItemData().type} />
        <input className='outline-0' {...item.getRenameInputProps()} />
      </div>
    </div>
  )
}

interface ItemViewSpacerProps {
  item: ItemInstance<TreeItem>
  handleItemClick: React.MouseEventHandler
}

function ItemViewSpacer({ item, handleItemClick }: ItemViewSpacerProps) {
  if (item.isFolder() && item.getChildren().length > 0) return (
    <div
      className='flex cursor-pointer text-ui-400'
      onClick={() => item.isExpanded() ? item.collapse() : item.expand()}
    >
      <div style={{ width: `${item.getItemMeta().level * 8}px` }} />
      {item.isExpanded() ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
    </div>
  )

  return (
    <div
      onClick={handleItemClick}
      className='h-full'
      style={{ width: `${item.getItemMeta().level * 8 + 12}px` }}
    />
  )
}

interface ItemViewContentProps {
  item: ItemInstance<TreeItem>
  object: Object3D
}

function ItemViewContent({ item, object }: ItemViewContentProps) {
  const { setObjectVersion } = useEditor()

  return (
    <div
      className={clsx(
        !object.visible && 'opacity-70',
        'flex w-full justify-between'
      )}
    >
      <div className='flex items-center gap-1'>
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
  )
}

interface ItemViewProps {
  tree: TreeInstance<TreeItem>
  item: ItemInstance<TreeItem>
}

export function TreeItemView({ tree, item }: ItemViewProps) {
  const { scene, setContextMenu } = useEditor()
  const [isHovered, setIsHovered] = useState<boolean>(false)

  const objectId = item.getItemData().id
  const object = scene.current.getObjectById(objectId)
  if (!object) return

  if (item.isRenaming()) return <RenamingItemView item={item} />

  /**
   * @summary custom implementation of the TreeItem onClick, since we want to exclude folder toggles (done separately by the Spacers)
   * @todo need to rework this, since F12 toggle doesn't work (just selects top-most item)
   */
  function handleItemClick(e: React.MouseEvent) {
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
      tree.getDataRef<{
        selectUpToAnchorId?: string | null
      }>().current.selectUpToAnchorId = item.getId()
    }
  }

  return (
    <div
      onMouseOver={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className='flex w-full items-center'
    >
      <ItemViewSpacer item={item} handleItemClick={handleItemClick} />
      <div
        {...item.getProps()}
        onClick={handleItemClick}
        onContextMenu={(e) => {
          e.preventDefault()
          if (isInternalObject(object)) return
          setContextMenu({ item, x: e.clientX, y: e.clientY })
        }}
        className={clsx(
          item.isSelected()
            ? 'border-teal/70 bg-teal/20'
            : isHovered ? 'bg-ui-800 border-ui-650' : 'border-transparent',
          'border w-full rounded-l-md px-1 focus:outline-none'
        )}
      >
        <ItemViewContent item={item} object={object} />
      </div>
    </div>
  )
}
