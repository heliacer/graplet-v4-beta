import { IDockviewPanelProps } from 'dockview-react'
import { useEditorStore } from '../../state'

export default function DebugPanel(props: IDockviewPanelProps) {
  const snapshots = useEditorStore(s => s.snapshots)

  return (
    <div className='m-4 overflow-auto'>
      <p className='italic'>Prototype</p>
      <p>ID: {props.api.id}</p>
      {/** test */}
      <br/>
      <div className='flex flex-col gap-2 text-sm'>
        {Object.entries(snapshots).map(([id, snapshot]) => (
          <p key={id}>
            {id}: {JSON.stringify(snapshot, null, 2)}
          </p>
        ))}
      </div>
    </div>
  )
}
