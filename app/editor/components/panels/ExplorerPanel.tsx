'use no memo'

import {
  createOnDropHandler,
  dragAndDropFeature,
  DragTarget,
  hotkeysCoreFeature,
  ItemInstance,
  renamingFeature,
  selectionFeature,
  syncDataLoaderFeature
} from '@headless-tree/core'
import { useEffect } from 'react'
import { useEditorRefs } from '../../context/editor'
import { useEditorStore } from '../../state'
import { useTree } from '@headless-tree/react'
import { TreeItem } from '../ui/TreeItem'
import { getObject } from '../../utils/three'
import { useObjectActions } from '../../hooks/useObjectActions'

export default function ExplorerPanel() {
  const { objectsRef } = useEditorRefs()
  const { moveObjects } = useObjectActions()
  const selectedItems = useEditorStore(s => s.selectedItems)
  const setSelectedItems = useEditorStore(s => s.setSelectedItems)
  const setContextMenu = useEditorStore(s => s.setContextMenu)
  const objectSnapshots = useEditorStore(s => s.objectSnapshots)
  const updateSnapshot = useEditorStore(s => s.updateSnapshot)
  const treeVersion = useEditorStore(s => s.treeVersion)

  function handleDrop(
    items: ItemInstance<string>[],
    target: DragTarget<string>
  ) {
    createOnDropHandler<string>((targetItem, newChildren) => {
      moveObjects(
        items.map(item => item.getId()),
        targetItem.getId(),
        newChildren
      )
    })(items, target)
  }

  const tree = useTree<string>({
    state: { selectedItems },
    setSelectedItems,
    rootItemId: 'scene',
    getItemName: item => objectSnapshots[item.getId()].name,
    isItemFolder: item => objectSnapshots[item.getId()].type === 'Group',
    onRename: (item, value) => {
      const sharedId = item.getId()
      const object = getObject(objectsRef, sharedId)
      object.name = value
      updateSnapshot(sharedId, {
        name: value
      })
    },
    onDrop: handleDrop,
    canReorder: true,
    dataLoader: {
      getItem: itemId => itemId,
      getChildren: itemId => {
        const item = objectSnapshots[itemId]
        return item !== undefined ? item.childIds : []
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => tree.rebuildTree(), [treeVersion])

  return (
    <div
      style={{ scrollbarWidth: 'thin' }}
      className='text-sm h-full overflow-y-scroll'
      {...tree.getContainerProps()}
      onClick={() => setContextMenu(null)}
      onContextMenu={e => {
        e.preventDefault()
        setContextMenu({ x: e.clientX, y: e.clientY })
      }}
    >
      <div className='py-1 flex flex-col items-start border-r border-ui-700 min-h-full'>
        {tree.getItems().map(item => (
          <TreeItem key={item.getId()} tree={tree} item={item} />
        ))}
      </div>
      <div
        style={tree.getDragLineStyle()}
        className='border mx-1 border-dashed border-teal'
      />
    </div>
  )
}
