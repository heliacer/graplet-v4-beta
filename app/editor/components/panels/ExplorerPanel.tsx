import { Box, FileText, type LucideIcon, Plus } from 'lucide-react'
import { useEditor } from '../../lib/EditorContext'
import { useObjectActions } from '../../lib/hooks/useObjectActions'
import { Object3D } from 'three'
import clsx from 'clsx'

const ITEM_TYPE_ICONS: Record<string, LucideIcon> = {
  Group: Box,
  default: FileText
}

function ItemIcon({ itemType }: { itemType: string }) {
  const Icon = ITEM_TYPE_ICONS[itemType] || ITEM_TYPE_ICONS.default
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
        <span className="text-zinc-400 text-sm ml-auto">{object.uuid}</span>
      </div>
    </button>
  )
}

export default function ExplorerPanel() {
  const { objectNames, objects } = useEditor()
  const { createObject } = useObjectActions()

  return (
    <main className="p-1.5 flex flex-col gap-1.5">
      <nav className="flex justify-between items-center">
        <button
          onClick={() => createObject()}
          className="text-sm text-nowrap flex items-center gap-1 cursor-pointer rounded px-1.5 py-0.5 bg-teal-600"
        >
          <Plus size={14} />
          Add Cube
        </button>
        {/* File Path */}
      </nav>
      <div className="flex gap-1 flex-col">
        {objectNames.map((name) => {
          const object = objects.current.get(name)
          return object ? <ObjectListItem key={name} object={object} /> : null
        })}
      </div>
    </main>
  )
}
