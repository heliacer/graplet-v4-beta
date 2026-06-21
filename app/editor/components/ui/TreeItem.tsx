'use no memo'

import { useId, useState } from 'react'
import { useEditorStore } from '../../state'
import { ItemInstance, TreeInstance } from '@headless-tree/core'
import { ChevronDown, ChevronRight, Eye, EyeClosed } from 'lucide-react'
import { getIconT, ItemIcon } from '../../utils/icons'
import { useEditorRefs } from '../../context/EditorContext'
import { getObject } from '../../utils/three'
import clsx from 'clsx'
import { useSnapshot } from '../../hooks/useSnapshot'

interface RenamingItemProps {
  item: ItemInstance<string>
}

function RenamingItem({ item }: RenamingItemProps) {
  const objectSnapshots = useEditorStore(s => s.objectSnapshots)

  const uuid = useId()
  const iconType = getIconT(objectSnapshots[item.getId()].type)

  return (
    <div className='flex w-full'>
      <div style={{ marginLeft: `${item.getItemMeta().level * 8 + 12}px` }} />
      <div className='flex items-center w-full px-1 gap-1 rounded-l-md border border-teal bg-ui-800'>
        <ItemIcon size={14} iconType={iconType} />
        <input
          id={uuid}
          className='outline-0'
          {...item.getRenameInputProps()}
        />
      </div>
    </div>
  )
}

interface ItemSpacerProps {
  item: ItemInstance<string>
  handleItemClick: React.MouseEventHandler
}

function ItemSpacer({ item, handleItemClick }: ItemSpacerProps) {
  if (item.isFolder() && item.getChildren().length > 0)
    return (
      <div
        className='flex text-ui-400 hover:text-ui-300'
        onClick={() => (item.isExpanded() ? item.collapse() : item.expand())}
      >
        <div style={{ width: `${item.getItemMeta().level * 8}px` }} />
        {item.isExpanded() ? (
          <ChevronDown size={12} />
        ) : (
          <ChevronRight size={12} />
        )}
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

interface ItemContentProps {
  item: ItemInstance<string>
}

function ItemContent({ item }: ItemContentProps) {
  const { objectsRef } = useEditorRefs()
  const updateSnapshot = useEditorStore(s => s.updateSnapshot)
  const sobject = useSnapshot(item.getId())
  const iconType = getIconT(sobject.type)

  return (
    <div
      className={clsx(
        !sobject.visible && 'opacity-70',
        'flex w-full justify-between'
      )}
    >
      <div className='flex items-center gap-1'>
        <ItemIcon size={14} iconType={iconType} />
        {item.getItemName()}
      </div>
      <button
        className={clsx(
          item.isSelected() || !sobject.visible ? 'block' : 'hidden',
          'cursor-pointer'
        )}
        onClick={e => {
          e.stopPropagation()
          const object = getObject(objectsRef, sobject.sharedId)
          object.visible = !object.visible
          updateSnapshot(sobject.sharedId, prev => ({
            ...prev,
            visible: !prev.visible
          }))
        }}
      >
        {sobject.visible ? <Eye size={12} /> : <EyeClosed size={12} />}
      </button>
    </div>
  )
}

interface ItemProps {
  tree: TreeInstance<string>
  item: ItemInstance<string>
}

export function TreeItem({ tree, item }: ItemProps) {
  const setContextMenu = useEditorStore(s => s.setContextMenu)
  const [isHovered, setIsHovered] = useState<boolean>(false)

  if (item.isRenaming()) return <RenamingItem item={item} />

  /** @todo (#61) Treeitem: Fix F2 renaming & shift selecting upwards */
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
      <ItemSpacer item={item} handleItemClick={handleItemClick} />
      <div
        {...item.getProps()}
        onClick={handleItemClick}
        onDoubleClick={() =>
          item.isExpanded() ? item.collapse() : item.expand()
        }
        onContextMenu={e => {
          e.preventDefault()
          e.stopPropagation()
          setContextMenu({ item, x: e.clientX, y: e.clientY })
        }}
        className={clsx(
          item.isSelected() ? 'bg-teal/20' : isHovered && 'bg-ui-750',
          'border focus:border-teal/50 border-transparent w-full rounded-l-md px-1 focus:outline-none'
        )}
      >
        <ItemContent item={item} />
      </div>
    </div>
  )
}
