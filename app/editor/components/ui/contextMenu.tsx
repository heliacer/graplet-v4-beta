import { useEditor } from '../../lib/EditorContext'

export function ContextMenu() {
  const { contextMenu } = useEditor()

  if (!contextMenu) return

  return (
    <div
      style={{ top: contextMenu.y, left: contextMenu.x }}
      className="absolute shadow-md bg-zinc-750 border border-zinc-650 p-1 text-sm rounded"
    >
      <p>test</p>
    </div>
  )
}
