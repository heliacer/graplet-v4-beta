import { useState } from 'react'
import { useEditorStore } from '../../state'
import {
  ClipboardCopy,
  ClipboardPaste,
  Copy,
  DiamondPlus,
  Group,
  Trash,
  Ungroup
} from 'lucide-react'
import { useObjectActions } from '../../hooks/useObjectActions'
import { createAddItemsMenu } from '../../utils/addItems'
import {
  DropdownContext,
  DropdownItemList,
  DropdownItemProps
} from '@/app/ui/components/Dropdown'
import { useClickOutside } from '@/app/ui/hooks/useClickOutside'

/** @todo (#35) Object Context Menu revamp + fix renaming */
export function ContextMenu() {
  const selectedItems = useEditorStore(s => s.selectedItems)
  const objectSnapshots = useEditorStore(s => s.objectSnapshots)
  const contextMenu = useEditorStore(s => s.contextMenu)
  const setContextMenu = useEditorStore(s => s.setContextMenu)
  const [activePath, setActivePath] = useState<number[]>([])
  const {
    removeObject,
    groupObjects,
    unGroupObject,
    cloneObject,
    copyObjects,
    pasteObjects,
    addObject
  } = useObjectActions()

  const ref = useClickOutside<HTMLDivElement>(() => {
    setContextMenu(null)
  })

  if (!contextMenu) return
  const menuItems: DropdownItemProps[] = []

  if (contextMenu.item) {
    const targetId = contextMenu.item.getId()
    const itemIds = selectedItems.includes(targetId)
      ? selectedItems
      : [targetId]

    const groups = itemIds.filter(
      itemId => objectSnapshots[itemId].type === 'Group'
    )
    const groupsWithChildren = groups.filter(
      itemId => objectSnapshots[itemId].childIds.length > 0
    )
    const isSingleGroup = groups.length > 0 && itemIds.length === 1
    const suffix = selectedItems.length > 1 ? '*' : ''

    menuItems.push(
      {
        label: `Copy ${suffix}`,
        Icon: ClipboardCopy,
        onClick: () => copyObjects(itemIds)
      },
      {
        label: 'Paste',
        disabled: !isSingleGroup,
        Icon: ClipboardPaste,
        onClick: () => pasteObjects(itemIds[0])
      },
      {
        label: 'Clone',
        Icon: Copy,
        disabled: selectedItems.length > 1,
        onClick: () => cloneObject(itemIds[0])
      },
      /** @todo (#47) Fix multiple selection grouping */
      {
        label: `Group ${suffix}`,
        Icon: Group,
        onClick: () => groupObjects(itemIds)
      }
    )

    if (isSingleGroup) {
      const objectAddItems = createAddItemsMenu(addObject, itemIds[0])
      menuItems.push({
        label: 'Add to Group',
        Icon: DiamondPlus,
        children: objectAddItems
      })
    }

    menuItems.push(
      {
        label: `Ungroup ${suffix}`,
        Icon: Ungroup,
        disabled: groupsWithChildren.length === 0,
        onClick: () => {
          for (const object of groupsWithChildren) {
            unGroupObject(object)
          }
        }
      },
      {
        label: `Delete ${suffix}`,
        Icon: Trash,
        onClick: async () => {
          for (const object of itemIds) {
            removeObject(object)
          }
        }
      }
    )
  } else {
    const objectAddItems = createAddItemsMenu(addObject)
    menuItems.push(
      {
        label: 'Paste',
        Icon: ClipboardPaste,
        onClick: () => pasteObjects()
      },
      {
        label: 'Add to Scene',
        Icon: DiamondPlus,
        children: objectAddItems
      }
    )
  }

  return (
    <div
      style={{
        top: contextMenu.y,
        left:
          contextMenu.x + 120 > window.innerWidth // contextMenu overflow
            ? window.innerWidth - 125 // context Menu max x
            : contextMenu.x
      }}
      className='absolute'
      ref={ref}
    >
      <DropdownContext.Provider
        value={{
          isOpen: true,
          activePath,
          setIsOpen: () => setContextMenu(null),
          setActivePath
        }}
      >
        <DropdownItemList items={menuItems} />
      </DropdownContext.Provider>
    </div>
  )
}
