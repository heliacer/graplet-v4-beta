import {
  ClipboardCopy,
  ClipboardPaste,
  Copy,
  DiamondPlus,
  Group,
  Trash,
  Ungroup
} from 'lucide-react'
import { useEditorRefs } from '../../lib/context'
import { useObjectActions } from '../../lib/hooks/useObjectActions'
import { createAddItemsMenu } from '../../lib/utils/addItems'
import {
  DropdownContext,
  DropdownItemList,
  DropdownItemProps
} from '@/app/ui/components/Dropdown'
import { useState } from 'react'
import { useClickOutside } from '@/app/ui/hooks/useClickOutside'
import { Object3D } from 'three'
import { useEditorStore } from '../../lib/state'

/** @todo (#35) Object Context Menu revamp + fix renaming */
export function ContextMenu() {
  const { scene, objects } = useEditorRefs()
  const selectedItems = useEditorStore(s => s.selectedItems)
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
    const selection: Object3D[] = []
    for (const itemId of itemIds) {
      const obj = objects.current.get(itemId)
      if (obj) selection.push(obj)
    }
    const groups = selection.filter(obj => obj.type === 'Group')
    const groupsWithChildren = groups.filter(obj => obj.children.length > 0)
    const isSingleGroup = groups.length > 0 && selection.length === 1
    const multipleSuffix = selectedItems.length > 1 ? '*' : ''

    menuItems.push(
      {
        label: `Copy ${multipleSuffix}`,
        Icon: ClipboardCopy,
        onClick: () => copyObjects(selection)
      },
      {
        label: 'Paste',
        disabled: !isSingleGroup,
        Icon: ClipboardPaste,
        onClick: () => pasteObjects(selection[0])
      },
      {
        label: 'Clone',
        Icon: Copy,
        disabled: selectedItems.length > 1,
        onClick: () => cloneObject(selection[0])
      },
      /** @todo (#47) Fix multiple selection grouping */
      {
        label: `Group ${multipleSuffix}`,
        Icon: Group,
        onClick: () => groupObjects(selection)
      }
    )

    if (isSingleGroup) {
      const objectAddItems = createAddItemsMenu(addObject, selection[0])
      menuItems.push({
        label: 'Add to Group',
        Icon: DiamondPlus,
        children: objectAddItems
      })
    }

    menuItems.push(
      {
        label: `Ungroup ${multipleSuffix}`,
        Icon: Ungroup,
        disabled: groupsWithChildren.length === 0,
        onClick: () => {
          for (const object of groupsWithChildren) {
            unGroupObject(object)
          }
        }
      },
      {
        label: `Delete ${multipleSuffix}`,
        Icon: Trash,
        onClick: async () => {
          for (const object of selection) {
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
        onClick: () => pasteObjects(scene.current)
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
