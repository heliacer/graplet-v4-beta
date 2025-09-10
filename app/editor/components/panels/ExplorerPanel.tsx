import { Box, FileText, type LucideIcon, Plus } from 'lucide-react'
import { useTrigger } from '../../lib/TriggerContext'
import { useEditor } from '../../lib/EditorContext'
import { useEffect, useReducer } from 'react'
import { Object3D } from 'three'
import clsx from 'clsx'

const ITEM_TYPE_ICONS: Record<string, LucideIcon> = {
  Mesh: Box,
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
        currentObject === object.name
          ? 'bg-zinc-800 border-zinc-700'
          : 'border-transparent hover:bg-zinc-800 hover:border-zinc-700'
      )}
      onClick={() => setCurrentObject(object.name)}
    >
      <div
        className={clsx(
          'flex gap-1 px-1 py-0.5 items-center border-b',
          currentObject === object.name
            ? 'border-accent'
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
  const emitter = useTrigger()
  const { objects } = useEditor()
  const [, forceUpdate] = useReducer((x) => x + 1, 0)

  useEffect(() => {
    emitter.on('objectCreated', forceUpdate)
    emitter.on('objectUpdated', forceUpdate)
    return () => {
      emitter.off('objectCreated', forceUpdate)
      emitter.off('objectUpdated', forceUpdate)
    }
  }, [emitter])

  return (
    <main className="p-1.5 flex flex-col gap-1.5">
      <nav className="flex justify-between items-center">
        <button
          onClick={() => emitter.emit('createObject')}
          className="text-sm text-nowrap flex items-center gap-1 cursor-pointer rounded px-1.5 py-0.5 bg-accent"
        >
          <Plus size={14} />
          Add Cube
        </button>
        {/* File Path */}
      </nav>
      <div className="flex gap-1 flex-col">
        {Array.from(objects.current).map(([key, object]) => (
          <ObjectListItem key={key} object={object} />
        ))}
      </div>
    </main>
  )
}
