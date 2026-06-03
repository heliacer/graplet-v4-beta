import { IDockviewPanelProps } from 'dockview-react'
import { useEditorStore } from '../../state'

export default function DebugPanel(props: IDockviewPanelProps) {
  const objectSnapshots = useEditorStore(s => s.objectSnapshots)

  return (
    <div className='m-4 overflow-auto'>
      <p className='italic'>Prototype</p>
      <p>ID: {props.api.id}</p>
      {/** test */}
      <br />
      <div className='flex flex-col gap-2 text-sm'>
        {Object.entries(objectSnapshots).map(([id, snapshot]) => (
          <p key={id}>
            {id}: {JSON.stringify(snapshot, null, 2)}
          </p>
        ))}
      </div>
    </div>
  )
}
