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
import { useEffect } from 'react'
import { TreeItemView } from '../ui/TreeItemView'
import { moveObject, isInternalObject } from '../../lib/utils/three'
import { NotFoundError, RegistryError, TreeItem } from '../../lib/types'

export default function ExplorerPanel() {
  const {
    objects,
    objectIds,
    objectVersion,
    selectedItems,
    setSelectedItems,
    setContextMenu,
    setObjectVersion
  } = useEditor()

  const tree = useTree<TreeItem>({
    state: { selectedItems },
    setSelectedItems,
    rootItemId: 'scene',
    getItemName: item => item.getItemData()?.name ?? 'Unnamed',
    isItemFolder: item => item.getItemData().type === 'Component',
    canRename: item => {
      const object = objects.current.get(item.getId())
      if (!object) return false
      return !isInternalObject(object)
    },
    onRename: (item, value) => {
      const object = objects.current.get(item.getId())
      if (object) object.name = value
      setObjectVersion(v => v + 1)
    },
    /**
     * @todo Add reordering for improved UX, and save the item state to serialization
     * Update: need to get the index of the drop location, then re-order the object children array
     * -> right now it just mimicks the Scene Object3D children array
     */
    onDrop: (items, target) => {
      console.log(items, target)
      for (const item of items) {
        const id = item.getId()
        const object = objects.current.get(id)
        if (!object) throw new NotFoundError(id)

        const targetId = target.item.getId()
        const targetObj = objects.current.get(targetId)
        if (!targetObj) throw new NotFoundError(targetId)

        moveObject(object, targetObj)
        setObjectVersion(v => v + 1)
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
      getChildren: itemId => {
        if (itemId === 'scene') return Array.from(objects.current.keys())
        const object = objects.current.get(itemId)
        if (!object) return []
        return object.children.map(object => {
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

  useEffect(() => tree.rebuildTree(), [objectVersion, tree])

  return (
    <div
      {...tree.getContainerProps()}
      style={{ scrollbarWidth: 'thin' }}
      className='text-sm h-full overflow-y-scroll'
      onClick={() => setContextMenu(null)}
      onContextMenu={e => {
        e.preventDefault()
        setContextMenu({ x: e.clientX, y: e.clientY })
      }}
    >
      <div className='py-1 flex flex-col gap-0.5 items-start border-r border-ui-700 min-h-full'>
        {tree.getItems().map(item => (
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
