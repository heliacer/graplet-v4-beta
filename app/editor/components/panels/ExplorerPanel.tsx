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
import { RegistryError, TreeItem } from '../../lib/types'

export default function ExplorerPanel() {
  const {
    objects,
    objectIds,
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
      const object = objects.current.get(items[0])
      setCurrentObject(object || null)
      setSelectedItems(items)
    },
    rootItemId: 'scene',
    getItemName: (item) => item.getItemData()?.name ?? 'Unnamed',
    isItemFolder: (item) => item.getItemData().type === 'Component',
    canRename: (item) => {
      const object = objects.current.get(item.getId())
      if (!object) return false
      return !isInternalObject(object)
    },
    onRename: (item, value) => {
      const object = objects.current.get(item.getId())
      if (object) object.name = value
      setObjectVersion((v) => v + 1)
    },
    /**
     * @todo Add reordering for improved UX, and save the item state to serialization
     * Update: need to get the index of the drop location, then re-order the object children array
     * -> right now it just mimicks the Scene Object3D children array
     */
    onDrop: (items, target) => {
      console.log(items, target)
      for (const item of items) {
        const object = objects.current.get(item.getId())
        if (!object) throw Error('Object from item does not exist')
        const targetObj = objects.current.get(target.item.getId())
        if (!targetObj)
          throw Error('Object from target Treeitem id does not exist')
        moveObject(object, targetObj)
        setObjectVersion((v) => v + 1)
      }
    },
    canReorder: true,
    dataLoader: {
      getItem: (itemId): TreeItem => {
        const object = objects.current.get(itemId)
        if (!object) return { name: '', type: 'Component', hasChildren: false }

        return {
          name: object.name || 'unnamed',
          type: getIconT(object.type),
          hasChildren: object.children.length > 0
        }
      },
      getChildren: (itemId) => {
        if (itemId === 'scene') return Array.from(objects.current.keys())
        const object = objects.current.get(itemId)
        if (!object) return []
        return object.children.map((object) => {
          const id = objectIds.current.get(object)
          if (!id) throw new RegistryError(object)
          return id
        })
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
      style={{ scrollbarWidth: 'thin' }}
      className='text-sm h-full overflow-y-scroll'
      onClick={() => setContextMenu(null)}
      onContextMenu={(e) => {
        e.preventDefault()
        setContextMenu({ x: e.clientX, y: e.clientY })
      }}
    >
      <div className='py-1 flex flex-col gap-0.5 items-start border-r border-ui-700 min-h-full'>
        {tree.getItems().map((item) => (
          <TreeItemView key={item.getId()} tree={tree} item={item} />
        ))}
      </div>
      <div
        /** @todo Upgrade looks */
        style={tree.getDragLineStyle()}
        className='border border-teal'
      />
    </div>
  )
}
