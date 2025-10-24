import {
  Box,
  Camera,
  FileText,
  Lightbulb,
  type LucideIcon,
  Sun,
  WandSparkles
} from 'lucide-react'
import { useEditor } from '../../lib/EditorContext'
import { useObjectActions } from '../../lib/hooks/useObjectActions'
import { Object3D } from 'three'
import clsx from 'clsx'

const ItemIcons: Record<string, LucideIcon> = {
  Group: Box,
  AmbientLight: Sun,
  DirectionalLight: Lightbulb,
  PerspectiveCamera: Camera,
  default: FileText
}

function ItemIcon({ itemType }: { itemType: string }) {
  const Icon = ItemIcons[itemType] || ItemIcons.default
  return <Icon size={16} />
}

function ObjectListItem({ object }: { object: Object3D }) {
  const { currentObject, setCurrentObject } = useEditor()

  return (
    <button
      className={clsx(
        'rounded-md cursor-pointer border border-b-0 overflow-clip',
        currentObject?.id === object.id
          ? 'bg-zinc-800 border-zinc-700'
          : 'border-transparent hover:bg-zinc-800 hover:border-zinc-700'
      )}
      onClick={() => setCurrentObject(object)}
    >
      <div
        className={clsx(
          'flex gap-1 px-1 py-0.5 items-center border-b',
          currentObject?.id === object.id
            ? 'border-teal-600'
            : 'hover:border-zinc-700 border-transparent'
        )}
      >
        <ItemIcon itemType={object.type} />
        <p className="text-sm">{object.name}</p>
        <span className="text-zinc-400 text-sm ml-auto">{object.id}</span>
      </div>
    </button>
  )
}

export default function ExplorerPanel() {
  const { scene, objectVersion } = useEditor()
  const { newSprite } = useObjectActions()

  return (
    <>
      <div
        key={objectVersion}
        className="h-full flex gap-1 flex-col p-1.5 overflow-y-auto"
      >
        {scene.current.children.map((obj) => (
          <ObjectListItem key={obj.id} object={obj} />
        ))}
        <br />
        <br />
      </div>
      <button
        onClick={newSprite}
        className={clsx(
          'flex items-center gap-1 px-1 absolute bottom-3 left-2',
          'border rounded-md bg-zinc-800 border-zinc-600 cursor-pointer'
        )}
      >
        <WandSparkles size={14} />
        <p className="text-sm">Add Sprite</p>
      </button>
    </>
  )
}
