import { useEditor } from '@/app/editor/lib/EditorContext'
import {
  hotkeysCoreFeature,
  selectionFeature,
  syncDataLoaderFeature
} from '@headless-tree/core'
import { useTree } from '@headless-tree/react'
import clsx from 'clsx'
import { Box } from 'lucide-react'
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
    canReorder: true,
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
    <div {...tree.getContainerProps()} className="flex flex-col gap-1 items-start">
      <div className="border-b border-zinc-700 w-full">
        <p>Outline</p>
      </div>
      {tree.getItems().map((item) => (
        <button
          className='bg-zinc-800 border rounded border-zinc-700 w-full'
          {...item.getProps()}
          key={item.getId()}
          style={{ marginLeft: `${item.getItemMeta().level * 20}px` }}
        >
          <div
            className={clsx(
            {
              'underline': item.isFocused(),
              'text-blue-500': item.isExpanded(),
              'italic': item.isSelected(),
              'bg-red-600': item.isFolder()
            },
            'flex flex-start items-center gap-1 text-xs'
          )}
          >
            <Box size={12}/>
            {item.getItemName()}
          </div>
        </button>
      ))}
    </div>
  )
}
