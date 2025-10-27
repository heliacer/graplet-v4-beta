import { useEditor } from '@/app/editor/lib/EditorContext'
import { IconT, Object3DIcon } from '@/app/editor/lib/utils/icons'
import {
  hotkeysCoreFeature,
  selectionFeature,
  syncDataLoaderFeature
} from '@headless-tree/core'
import { useTree } from '@headless-tree/react'
import clsx from 'clsx'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useEffect } from 'react'
import { Object3D } from 'three'

export default function Ouline() {
  const { currentObject } = useEditor()
  if (!currentObject) return
  return <Tree currentObject={currentObject} />
}

interface TreeItem {
  id: number
  name: string
  iconType: IconT
  hasChildren: boolean
}

function Tree({ currentObject }: { currentObject: Object3D }) {
  const { scene, objectVersion } = useEditor()
  const tree = useTree<TreeItem>({
    rootItemId: currentObject.id.toString(),
    getItemName: (item) => item.getItemData()?.name ?? 'Unnamed',
    isItemFolder: (item) => item.getItemData()?.hasChildren === true,
    canReorder: true,
    dataLoader: {
      getItem: (itemId) => {
        const object = scene.current.getObjectById(Number(itemId))
        if (!object)
          return { id: 0, name: '', iconType: 'Mesh', hasChildren: false }
        return {
          id: object.id,
          name: object.name || 'Unnamed',
          iconType: object.type as IconT,
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
    <>
      <div className="text-sm mb-1 border-b border-zinc-700 w-full">
        <p>Outline</p>
      </div>
      <div
        {...tree.getContainerProps()}
        className="text-sm ml-1 flex flex-col gap-1 items-start"
      >
        {tree.getItems().map((item) => (
          <button
            className={clsx(
              'cursor-pointer w-full border border-b-0 rounded-l',
              item.isSelected()
                ? 'border-zinc-700'
                : 'hover:border-zinc-700 border-transparent'
            )}
            {...item.getProps()}
            key={item.getId()}
            style={{ marginLeft: `${item.getItemMeta().level * 8}px` }}
          >
            <div
              className={clsx(
                'flex flex-start pl-1 items-center gap-1',
                'border-b rounded-l',
                item.isSelected()
                  ? 'border-teal-600 bg-zinc-800'
                  : 'hover:border-zinc-700 hover:bg-zinc-800 border-transparent'
              )}
            >
              <Object3DIcon size={14} iconType={item.getItemData().iconType} />
              {item.getItemName()}
              {item.isFolder() ? (
                item.isExpanded() ? (
                  <ChevronDown size={12} />
                ) : (
                  <ChevronRight size={12} />
                )
              ) : (
                ''
              )}
            </div>
          </button>
        ))}
      </div>
    </>
  )
}
