import { IDockviewPanelProps } from 'dockview-react'
import { useEditorStore } from '../../state'

export default function DebugPanel(props: IDockviewPanelProps) {
  const objectSnapshots = useEditorStore(s => s.objectSnapshots)

  return (
    <div className='text-sm h-full overflow-auto'>
      <p className='italic'>Prototype</p>
      <p>ID: {props.api.id}</p>
      {/* test */}
      {Object.entries(objectSnapshots).map(([id, snapshot]) => (
        <p key={id}>
          {id}: {JSON.stringify(snapshot, null, 2)}
        </p>
      ))}
    </div>
  )
}
