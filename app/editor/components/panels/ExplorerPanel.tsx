import { useEditorRefs } from '@/app/editor/lib/context'
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
import { NotFoundError, TreeItem } from '../../lib/types'
import { useEditorStore } from '../../lib/state'

export default function ExplorerPanel() {
  const { objects, scene } = useEditorRefs()
  const selectedItems = useEditorStore(s => s.selectedItems)
  const setSelectedItems = useEditorStore(s => s.setSelectedItems)
  const setContextMenu = useEditorStore(s => s.setContextMenu)
  const updateObject = useEditorStore(s => s.updateObject)
  const invalidateObject = useEditorStore(s => s.invalidateObject)
  const objectVersions = useEditorStore(s => s.objectVersions)

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
      if (object) updateObject(object, o => (o.name = value))
    },
    /** @todo (#60) Add reordering for improved UX */
    onDrop: (items, target) => {
      for (const item of items) {
        const id = item.getId()
        const object = objects.current.get(id)
        if (!object) throw new NotFoundError(id)

        const targetId = target.item.getId()
        const targetObj =
          targetId === 'scene' ? scene.current : objects.current.get(targetId)
        if (!targetObj) throw new NotFoundError(targetId)

        moveObject(object, targetObj)
        invalidateObject(object)
      }
    },
    canReorder: true,
    dataLoader: {
      getItem: (itemId): TreeItem => {
        const object =
          itemId === 'scene' ? scene.current : objects.current.get(itemId)
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
          itemId === 'scene' ? scene.current : objects.current.get(itemId)
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
        style={tree.getDragLineStyle()}
        className='border border-teal'
      />
    </div>
  )
}
