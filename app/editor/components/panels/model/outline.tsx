import { useEditor } from "@/app/editor/lib/EditorContext"
import { hotkeysCoreFeature, selectionFeature, syncDataLoaderFeature } from "@headless-tree/core"
import { useTree } from "@headless-tree/react"
import clsx from "clsx"
import { useEffect } from "react"
import { Object3D } from "three"

export default function Ouline() {
  const { scene, objectVersion, currentObject } = useEditor()
  if (!currentObject) return

  const tree = useTree<Object3D>({
    rootItemId: currentObject.id.toString(),
    getItemName: (item) => item.getItemData()?.name || 'Unnamed',
    isItemFolder: () => true,
    dataLoader: {
      getItem: (itemId) => {
        const object = scene.current.getObjectById(Number(itemId))
        if (!object) throw Error(`No object exists with id ${itemId}`)
        return object
      },
      getChildren: (itemId) => {
        const object = scene.current.getObjectById(Number(itemId))
        if (!object) throw Error(`No object exists with id ${itemId}`)
        const childIds: string[] = []
        for (const child of object.children) {
          childIds.push(child.id.toString())
        }
        return childIds
      },
    },
    features: [syncDataLoaderFeature, selectionFeature, hotkeysCoreFeature],
  })

  useEffect(() => {
    tree.rebuildTree()
  }, [objectVersion, currentObject])

  return (
    <div
      {...tree.getContainerProps()}
      className="flex flex-col items-start"
    >
      <div className='border-b border-zinc-700 w-full'>
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
              folder: item.isFolder(),
            })}
          >
            {item.getItemName()}
          </div>
        </button>
      ))}
    </div>
  )
}