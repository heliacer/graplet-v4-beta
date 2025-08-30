import { Box, PenTool, FileText } from "lucide-react"
import { useTrigger } from "../../lib/TriggerContext"
import { useEditor } from "../../lib/EditorContext"
import { useEffect, useReducer } from "react"
import clsx from "clsx"

function ItemIcon({ itemType }: { itemType: string }) {
  switch (itemType) {
    case 'Mesh':
      return <Box size={16} />
    default:
      return <FileText size={16} />
  }
}

// this looks very messy now, will need to refactor later
function Item({ name, id, type }: { name: string, id: string, type: string }) {
  const { currentObject, setCurrentObject } = useEditor()
  return (
    <button
      className={clsx(
        'rounded-md cursor-pointer border border-b-0',
        currentObject === id ? 'bg-zinc-800 border-zinc-700' : 'border-transparent hover:bg-zinc-800 hover:border-zinc-700'
      )}
      onClick={() => setCurrentObject(id)}
    >
      <main className={clsx(
        'flex gap-1 px-1 items-center border-b rounded-md',
        currentObject === id ? 'border-accent' : 'hover:border-zinc-700 border-transparent'
        )}
      >
        <ItemIcon itemType={type} />
        <p className="text-[15px]">{name}</p>
        <em className="text-zinc-400 text-sm">{id}</em>
      </main>
    </button>
  )
}



export default function ExplorerPanel() {
  const emitter = useTrigger()
  const { objects } = useEditor()
  const [, forceUpdate] = useReducer(x => x + 1, 0) // Only for object list changes

  useEffect(() => {
    emitter.on('createObject', forceUpdate)
  })

  return (
    <main className="px-1.5 py-1.5 flex flex-col gap-1.5">
      <nav className="flex">
        <button
          onClick={() => emitter.emit('createObject')}
          className="text-sm text-nowrap flex items-center gap-1 cursor-pointer rounded px-1.5 bg-accent"
        >
          <PenTool size={14} />
          New Model
        </button>
        {/* File Path */}
      </nav>
      <div className="flex gap-1 flex-col">
        {Array.from(objects.current).map(([id, object]) => (
          <Item
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