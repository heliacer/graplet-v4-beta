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
import { TreeItemView } from '../ui/TreeItemView'
import { moveObject, isInternalObject } from '../../lib/utils/three'
import { TreeItem } from '../../lib/types'

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
      /**
       * @summary Sets multiselect items state, while in the current context state only one object can be selected.
       * @todo This is good for now, but once multiple 3D Objects can be selected (maybe temporary group) then it should share the same state.
       */
      const items = value as string[]
      const object = scene.current.getObjectById(Number(items[0]))
      setCurrentObject(object || null)
      setSelectedItems(items)
    },
    rootItemId: scene.current.id.toString(),
    getItemName: (item) => item.getItemData()?.name ?? 'Unnamed',
    isItemFolder: (item) => item.getItemData().type === 'Component',
    canRename: (item) => {
      const object = scene.current.getObjectById(item.getItemData().id)
      if (!object) return false
      return !isInternalObject(object)
    },
    onRename: (item, value) => {
      const id = item.getItemData().id
      const object = scene.current.getObjectById(id)
      if (object) object.name = value
      setObjectVersion((v) => v + 1)
    },
    /**
     * @todo Add reordering for improved UX, and save the item state to serialisation
     * -> right now it just mimicks the Scene Object3D children array
     */
    onDrop: (items, target) => {
      console.log(items, target)
      for (const item of items) {
        const object = scene.current.getObjectById(item.getItemData().id)
        if (!object) throw Error('Object from item does not exist')
        const targetObj = scene.current.getObjectById(
          target.item.getItemData().id
        )
        if (!targetObj) throw Error('Object from target item does not exist')
        moveObject(object, targetObj)
        setObjectVersion((v) => v + 1)
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
        return object.children
          .filter((obj) => !isInternalObject(obj))
          .map((obj) => String(obj.id))
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

  /** @todo Not needed if upgraded to share state */
  useEffect(() => {
    tree.rebuildTree()
    setSelectedItems((prev) =>
      currentObject ? [currentObject.id.toString()] : prev
    )
  }, [objectVersion, tree, currentObject, currentTool])

  return (
    <div
      {...tree.getContainerProps()}
      className='text-sm py-1 flex flex-col items-start h-full overflow-auto'
      onClick={() => setContextMenu(null)}
      onContextMenu={(e) => e.preventDefault()}
    >
      {tree.getItems().map((item) => (
        <TreeItemView key={item.getId()} tree={tree} item={item} />
      ))}
      <div
        /** @todo Upgrade looks */
        style={tree.getDragLineStyle()}
        className='border border-teal'
      />
    </div>
  )
}
