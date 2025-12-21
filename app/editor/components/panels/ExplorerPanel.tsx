import { useEditor } from '@/app/editor/lib/EditorContext'
import { getIconT } from '@/app/editor/lib/utils/icons'
import {
  dragAndDropFeature,
  hotkeysCoreFeature,
  renamingFeature,
  selectionFeature,
  syncDataLoaderFeature
} from '@headless-tree/core'
import { useTree } from '@headless-tree/react'
import { useEffect, useState } from 'react'
import { isInternalObject } from '../../lib/utils/sobject3d'
import { TreeItem, TreeItemView } from '../ui/TreeItemView'

/** @todo needs some refactoring */
export default function ExplorerPanel() {
  const {
    scene,
    setObjectVersion,
    currentObject,
    setCurrentObject,
    objectVersion,
    setContextMenu,
    currentTool
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
    },
    rootItemId: scene.current.id.toString(),
    getItemName: (item) => item.getItemData()?.name ?? 'Unnamed',
    isItemFolder: (item) =>
      item.getItemData().type ===
      'Component' /** @todo this is just a workaround */,
    canRename: (item) => {
      const object = scene.current.getObjectById(item.getItemData().id)
      if (!object) return false
      return !isInternalObject(object)
    },
    onRename: (item, value) => {
      const id = item.getItemData().id
      const object = scene.current.getObjectById(id)
      if (object) object.name = value
      setObjectVersion((prev) => prev + 1)
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
  }, [objectVersion, tree, currentObject, currentTool])

  /** @todo add visibility toggle + lock item + better group dropdown */
  return (
    <div
      {...tree.getContainerProps()}
      className='text-sm py-1 flex flex-col gap-1 items-start h-full overflow-auto'
      /** not a fan of this at all, ima go with it for now */
      onClick={() => setContextMenu(null)}
      onContextMenu={(e) => e.preventDefault()}
    >
      {tree.getItems().map((item) => (
        <TreeItemView key={item.getId()} tree={tree} item={item} />
      ))}
      <div
        style={tree.getDragLineStyle()}
        className='border border-teal rounded'
      />
      <em>Current: {currentObject?.name}</em>
      <em>Object version: {objectVersion}</em>
    </div>
  )
}
