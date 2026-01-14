import {
  ClipboardCopy,
  ClipboardPaste,
  Copy,
  DiamondPlus,
  Group,
  Trash,
  Ungroup
} from 'lucide-react'
import { useEditor } from '../../lib/EditorContext'
import { useObjectActions } from '../../lib/hooks/useObjectActions'
import { createAddItemsMenu } from '../../lib/utils/addItems'
import {
  DropdownContext,
  DropdownItemList,
  DropdownItemProps
} from '@/app/ui/components/Dropdown'
import { useState } from 'react'
import { useClickOutside } from '@/app/ui/hooks/useClickOutside'

/**
 * @todo This shit is unstable, renaming doesn't work,
 * need to find a solution to put it together
 */
export function ContextMenu() {
  const { contextMenu, setContextMenu, scene } = useEditor()
  const [activePath, setActivePath] = useState<number[]>([])
  const {
    removeObject,
    groupObject,
    unGroupObject,
    cloneObject,
    copyObjects,
    pasteObjects,
    addObject
  } = useObjectActions()

  const refClick = useClickOutside<HTMLDivElement>(() => {
    setContextMenu(null)
  })

  if (!contextMenu) return

  const treeItem = contextMenu.item
  const menuItems: DropdownItemProps[] = []

  if (treeItem) {
    const objectId = treeItem.getItemData().id
    const object = scene.current.getObjectById(objectId)
    if (!object) return
    const isGroup = object.type === 'Group'

    menuItems.push(
      {
        label: 'Copy',
        Icon: ClipboardCopy,
        onClick: () => copyObjects([object])
      },
      {
        label: 'Paste',
        disabled: !isGroup,
        Icon: ClipboardPaste,
        onClick: () => pasteObjects(object)
      },
      {
        label: 'Clone',
        Icon: Copy,
        onClick: () => cloneObject(object)
      },
      {
        label: 'Group',
        Icon: Group,
        onClick: () => groupObject(object)
      }
    )

    if (isGroup) {
      const objectAddItems = createAddItemsMenu(addObject, object)
      menuItems.push({
        label: `Add to ${object.name}`,
        Icon: DiamondPlus,
        children: objectAddItems
      })
    }

    menuItems.push(
      {
        label: 'Ungroup',
        Icon: Ungroup,
        disabled: object.children.length === 0,
        onClick: () => unGroupObject(object)
      },
      {
        label: 'Delete',
        Icon: Trash,
        onClick: () => removeObject(object)
      }
    )
  } else {
    const objectAddItems = createAddItemsMenu(addObject)
    menuItems.push(
      {
        label: 'Add to Scene',
        Icon: DiamondPlus,
        children: objectAddItems
      },
      {
        label: 'Paste',
        Icon: ClipboardPaste,
        onClick: () => pasteObjects(scene.current)
      }
    )
  }

  return (
    <div
      style={{ top: contextMenu.y, left: contextMenu.x }}
      className='absolute'
      ref={refClick}
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
