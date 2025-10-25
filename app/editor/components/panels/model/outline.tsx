import { useEditor } from '@/app/editor/lib/EditorContext'
import {
  hotkeysCoreFeature,
  selectionFeature,
  syncDataLoaderFeature
} from '@headless-tree/core'
import { useTree } from '@headless-tree/react'
import clsx from 'clsx'
import { useEffect } from 'react'
import { Object3D } from 'three'

export default function Ouline() {
  const { currentObject } = useEditor()
  if (!currentObject) return
  return <Tree currentObject={currentObject} />
}

function Tree({ currentObject }: { currentObject: Object3D }) {
  const { scene, objectVersion } = useEditor()
  const tree = useTree<{ id: number; name: string; hasChildren: boolean }>({
    rootItemId: currentObject.id.toString(),
    getItemName: (item) => item.getItemData()?.name ?? 'Unnamed',
    isItemFolder: (item) => item.getItemData()?.hasChildren === true,
    dataLoader: {
      getItem: (itemId) => {
        const object = scene.current.getObjectById(Number(itemId))
        if (!object) return { id: 0, name: '', hasChildren: false }
        return {
          id: object.id,
          name: object.name || 'Unnamed',
          hasChildren: object.children.length > 0
        }
      },

      getChildren: (itemId) => {
        const object = scene.current.getObjectById(Number(itemId))
        if (!object) return []
        return object.children.map((c) => String(c.id))
      }
    },
    features: [syncDataLoaderFeature, selectionFeature, hotkeysCoreFeature]
  })

  useEffect(() => {
    tree.rebuildTree()
  }, [objectVersion, tree, currentObject])

  return (
    <div {...tree.getContainerProps()} className="flex flex-col items-start">
      <div className="border-b border-zinc-700 w-full">
        <p>Outline</p>
      </div>
      {tree.getItems().map((item) => (
        <button
          {...item.getProps()}
          key={item.getId()}
          style={{ paddingLeft: `${item.getItemMeta().level * 20}px` }}
        >
          <div
            className={clsx({
              focused: item.isFocused(),
              expanded: item.isExpanded(),
              selected: item.isSelected(),
              folder: item.isFolder()
            })}
          >
            {item.getItemName()}
          </div>
        </button>
      ))}
    </div>
  )
}
