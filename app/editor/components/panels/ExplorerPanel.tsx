import { Box, FileText, type LucideIcon, Plus } from 'lucide-react'
import { useTrigger } from '../../lib/TriggerContext'
import { useEditor } from '../../lib/EditorContext'
import { useEffect, useReducer } from 'react'
import clsx from 'clsx'

const ITEM_TYPE_ICONS: Record<string, LucideIcon> = {
  Mesh: Box,
  default: FileText
}

function ItemIcon({ itemType }: { itemType: string }) {
  const Icon = ITEM_TYPE_ICONS[itemType] || ITEM_TYPE_ICONS.default
  return <Icon size={16} />
}

type ObjectItemProps = {
  name: string
  id: string
  type: string
}

function ObjectListItem({ name, id, type }: ObjectItemProps) {
  const { currentObject, setCurrentObject } = useEditor()
  const isSelected = currentObject === id

  return (
    <button
      className={clsx(
        'rounded-md cursor-pointer border border-b-0 overflow-clip',
        isSelected
          ? 'bg-zinc-800 border-zinc-700'
          : 'border-transparent hover:bg-zinc-800 hover:border-zinc-700'
      )}
      onClick={() => setCurrentObject(id)}
    >
      <div
        className={clsx(
          'flex gap-1 px-1 py-0.5 items-center border-b',
          isSelected
            ? 'border-accent'
            : 'hover:border-zinc-700 border-transparent'
        )}
      >
        <ItemIcon itemType={type} />
        <p className="text-sm">{name}</p>
        <span className="text-zinc-400 text-sm ml-auto">{id}</span>
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
        {Array.from(objects.current).map(([id, object]) => (
          <ObjectListItem
            key={id}
            id={id}
            name={object.name}
            type={object.type}
          />
        ))}
      </div>
    </main>
  )
}
