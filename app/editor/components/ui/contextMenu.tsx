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
 *
 * relocating on edge also not working yet, wip
 */
export function ContextMenu() {
  const { contextMenu, setContextMenu, scene, objects } = useEditor()
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

  const ref = useClickOutside<HTMLDivElement>(() => {
    setContextMenu(null)
  })

  if (!contextMenu) return
  const { item } = contextMenu
  const menuItems: DropdownItemProps[] = []

  if (item) {
    const object = objects.current.get(item.getId())
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
