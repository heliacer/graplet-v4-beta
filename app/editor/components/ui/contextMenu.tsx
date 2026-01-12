import { DiamondPlus, Group, Trash, Ungroup } from 'lucide-react'
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
  const { removeObject, groupObject, unGroupObject, addObject } =
    useObjectActions()
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

    /**
     * @todo create a hook for these object editing items,
     * streamline them together with scene/treeitem (currently not in sync!)
     */
    if (object.type === 'Group') {
      const objectAddItems = createAddItemsMenu(addObject, object)
      menuItems.push({
        label: `Add Object to ${object.name}`,
        Icon: DiamondPlus,
        children: objectAddItems
      })
    }

    menuItems.push(
      {
        label: 'Group',
        Icon: Group,
        onClick: () => groupObject(object)
      },
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
    menuItems.push({
      label: 'Add Object',
      Icon: DiamondPlus,
      children: objectAddItems
    })
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
