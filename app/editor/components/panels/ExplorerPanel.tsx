import { useEditor } from '@/app/editor/lib/EditorContext'
import { getIconT, IconT, ItemIcon } from '@/app/editor/lib/utils/icons'
import {
  dragAndDropFeature,
  hotkeysCoreFeature,
  renamingFeature,
  selectionFeature,
  syncDataLoaderFeature
} from '@headless-tree/core'
import { useTree } from '@headless-tree/react'
import clsx from 'clsx'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Fragment, useEffect, useState } from 'react'

interface TreeItem {
  id: number
  name: string
  type: IconT
  hasChildren: boolean
}

export default function ExplorerPanel() {
  const {
    scene,
    setObjectVersion,
    currentObject,
    setCurrentObject,
    objectVersion,
    setContextMenu
  } = useEditor()
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const tree = useTree<TreeItem>({
    state: { selectedItems },
    setSelectedItems: (value) => {
      /** @todo workaround, needs one primar source of truth, didn't come up with a good solution yet */
      const items = value as string[]
      setCurrentObject((prev) =>
        items ? scene.current.getObjectById(Number(items[0])) || prev : prev
      )
      setSelectedItems(items)
      console.log(items)
    },
    rootItemId: scene.current.id.toString(),
    getItemName: (item) => item.getItemData()?.name ?? 'Unnamed',
    isItemFolder: (item) =>
      item.getItemData().type ===
      'Component' /** @todo this is just a workaround */,
    onRename: (item, value) => {
      console.log(value)
      const id = item.getItemData().id
      const object = scene.current.getObjectById(id)
      if (object) object.name = value
    },
    onDrop: (items, target) => {
      for (const item of items) {
        const object = scene.current.getObjectById(item.getItemData().id)
        if (!object) throw Error('Object from item does not exist')
        const parentItem = item.getParent()
        if (!parentItem) throw Error('Item does not have a parent')
        const parentObject = scene.current.getObjectById(
          parentItem.getItemData().id
        )
        if (!parentObject) throw Error('Object from parent item does not exist')
        parentObject.remove(object)
        const targetObject = scene.current.getObjectById(
          target.item.getItemData().id
        )
        if (!targetObject) throw Error('Object from target item does not exist')
        targetObject.add(object)
        console.log(items, target)
        setObjectVersion((prev) => prev + 1)
      }
    },
    canReorder: true,
    dataLoader: {
      getItem: (itemId) => {
        const object = scene.current.getObjectById(Number(itemId))
        if (!object)
          return { id: 0, name: '', type: 'Component', hasChildren: false }
        return {
          id: object.id,
          name: object.name || 'Unnamed',
          type: getIconT(object.type),
          hasChildren: object.children.length > 0
        }
      },
      getChildren: (itemId) => {
        const object = scene.current.getObjectById(Number(itemId))
        if (!object) return []
        return object.children.map((c) => String(c.id))
      }
    },
    features: [
      syncDataLoaderFeature,
      renamingFeature,
      selectionFeature,
      hotkeysCoreFeature,
      dragAndDropFeature
    ]
  })

  /** @todo this is complete bs, need to come up with a more common way */
  useEffect(() => {
    // keeps track of object changes
    tree.rebuildTree()
    setSelectedItems((prev) =>
      currentObject ? [currentObject.id.toString()] : prev
    )
  }, [objectVersion, tree, currentObject])

  return (
    <div
      {...tree.getContainerProps()}
      className="text-sm ml-1 py-1 flex flex-col gap-1 items-start h-full"
      /** not a fan of this at all, ima go with it for now */
      onContextMenu={(e: React.MouseEvent) => {
        e.preventDefault()
        setContextMenu({ x: e.clientX, y: e.clientY })
      }}
      onClick={() => setContextMenu(null)}
    >
      <p>current: {currentObject?.name}</p>
      {tree.getItems().map((item) => (
        <Fragment key={item.getId()}>
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
            <div className="flex w-full">
              <div
                style={{ marginLeft: `${item.getItemMeta().level * 8}px` }}
              />
              <button
                className={clsx(
                  'cursor-pointer w-full border-l rounded-l',
                  item.isSelected()
                    ? 'border-teal-600 bg-zinc-800'
                    : 'hover:border-zinc-700 hover:bg-zinc-800 border-transparent'
                )}
                {...item.getProps()}
                key={item.getId()}
                onDoubleClick={() => item.startRenaming()}
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
                </div>
              </button>
            </div>
          )}
        </Fragment>
      ))}
      <div
        style={tree.getDragLineStyle()}
        className="border border-teal-600 rounded"
      />
    </div>
  )
}
