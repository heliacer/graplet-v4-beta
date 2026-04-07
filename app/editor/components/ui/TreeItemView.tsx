import { ItemInstance, TreeInstance } from '@headless-tree/core'
import { ItemIcon } from '../../lib/utils/icons'
import clsx from 'clsx'
import { useEditorRefs } from '../../lib/EditorContext'
import { ChevronDown, ChevronRight, Eye, EyeClosed } from 'lucide-react'
import { useId, useState } from 'react'
import { Object3D } from 'three'
import { isInternalObject } from '../../lib/utils/three'
import { TreeItem } from '../../lib/types'
import { useEditorStore } from '../../lib/state'

interface RenamingItemViewProps {
  item: ItemInstance<TreeItem>
}

function RenamingItemView({ item }: RenamingItemViewProps) {
  const uuid = useId()
  return (
    <div className='flex w-full'>
      <div style={{ marginLeft: `${item.getItemMeta().level * 8 + 12}px` }} />
      <div className='flex items-center w-full px-1 gap-1 rounded-l-md border border-teal bg-ui-800'>
        <ItemIcon size={14} iconType={item.getItemData().type} />
        <input
          id={uuid}
          className='outline-0'
          {...item.getRenameInputProps()}
        />
      </div>
    </div>
  )
}

interface ItemViewSpacerProps {
  item: ItemInstance<TreeItem>
  handleItemClick: React.MouseEventHandler
}

function ItemViewSpacer({ item, handleItemClick }: ItemViewSpacerProps) {
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

interface ItemViewContentProps {
  item: ItemInstance<TreeItem>
  object: Object3D
}

function ItemViewContent({ item, object }: ItemViewContentProps) {
  const { setObjectVersion } = useEditorRefs()

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
        onClick={e => {
          e.stopPropagation()
          object.visible = !object.visible
          setObjectVersion(v => v + 1)
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
  const { objects } = useEditorRefs()
  const setContextMenu = useEditorStore(s => s.setContextMenu)
  const [isHovered, setIsHovered] = useState<boolean>(false)

  const object = objects.current.get(item.getId())
  if (!object) return

  if (item.isRenaming()) return <RenamingItemView item={item} />

  /**
   * @summary Custom implementation of the TreeItem onClick, since we want to exclude folder toggles (done separately by the Spacers)
   * @todo F12 toggle doesn't work (just selects top-most item)
   * @todo Shift selecting upwards does not work
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
        onDoubleClick={() =>
          item.isExpanded() ? item.collapse() : item.expand()
        }
        onContextMenu={e => {
          e.preventDefault()
          e.stopPropagation()
          if (isInternalObject(object)) return
          setContextMenu({ item, x: e.clientX, y: e.clientY })
        }}
        className={clsx(
          item.isSelected() ? 'bg-teal/20' : isHovered && 'bg-ui-750',
          'border focus:border-teal/50 border-transparent w-full rounded-l-md px-1'
        )}
      >
        <ItemViewContent item={item} object={object} />
      </div>
    </div>
  )
}
