'use no memo'

import {
  createOnDropHandler,
  dragAndDropFeature,
  hotkeysCoreFeature,
  renamingFeature,
  selectionFeature,
  syncDataLoaderFeature
} from '@headless-tree/core'
import { useEffect } from 'react'
import { useEditorRefs } from '../../context/editor'
import { useEditorStore } from '../../state'
import { useTree } from '@headless-tree/react'
import { TreeItemView } from '../ui/TreeItemView'
import { getObject, isInternalObject } from '../../utils/three'
import { TreeItem } from '../../types'
import { getIconT } from '../../utils/icons'
import { useObjectActions } from '../../hooks/useObjectActions'

export default function ExplorerPanel() {
  const { objectsRef, sceneRef } = useEditorRefs()
  const { moveObjects } = useObjectActions()
  const selectedItems = useEditorStore(s => s.selectedItems)
  const setSelectedItems = useEditorStore(s => s.setSelectedItems)
  const setContextMenu = useEditorStore(s => s.setContextMenu)
  const invalidateObject = useEditorStore(s => s.invalidateObject)
  const updateSnapshot = useEditorStore(s => s.updateSnapshot)
  const objectVersions = useEditorStore(s => s.objectVersions)

  const tree = useTree<TreeItem>({
    state: { selectedItems },
    setSelectedItems,
    rootItemId: 'scene',
    getItemName: item => item.getItemData()?.name ?? 'Unnamed',
    isItemFolder: item => item.getItemData().type === 'Component',
    canRename: item => {
      const object = getObject(objectsRef, item.getId())
      if (!object) return false
      return !isInternalObject(object)
    },
    onRename: (item, value) => {
      const sharedId = item.getId()
      const object = getObject(objectsRef, sharedId)
      object.name = value
      updateSnapshot(sharedId, {
        name: value
      })
      invalidateObject(object)
    },
    /**
     *  @todo (#60) Add reordering for improved UX
     *  @todo  (#84) moveItems indexing: make a drop handler with items
     * that can be reordered. (wip, this does not work)
     */
    onDrop: (items, target) =>
      createOnDropHandler<TreeItem>((targetItem, newChildren) => {
        moveObjects(
          items.map(item => item.getId()),
          targetItem.getId(),
          newChildren
        )
      })(items, target),
    canReorder: true,
    dataLoader: {
      getItem: (itemId): TreeItem => {
        const object =
          itemId === 'scene' ? sceneRef.current : objectsRef.current.get(itemId)
        if (!object) return { name: '', type: 'Component', hasChildren: false }

        return {
          name: object.name || 'unnamed',
          type: getIconT(object.type),
          hasChildren:
            object.children.filter(c => !isInternalObject(c)).length > 0
        }
      },
      getChildren: itemId => {
        const object =
          itemId === 'scene' ? sceneRef.current : objectsRef.current.get(itemId)
        if (!object) return []
        return object.children
          .filter(object => !isInternalObject(object))
          .map(object => {
            const id = object.sharedId
            if (!id) throw Error(`${object.name} does not have a sharedId`)
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

  useEffect(() => tree.rebuildTree(), [objectVersions, tree])

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
      <div className='py-1 flex flex-col items-start border-r border-ui-700 min-h-full'>
        {tree.getItems().map(item => (
          <TreeItemView key={item.getId()} tree={tree} item={item} />
        ))}
      </div>
      <div
        /** @todo (#60) upgrade looks */
        style={tree.getDragLineStyle(29)}
        className='border border-dashed border-teal'
      />
    </div>
  ) 
}
