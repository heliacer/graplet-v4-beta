import { useEditorStore } from '../../state'

export default function DebugPanel() {
  const objectSnapshots = useEditorStore(s => s.objectSnapshots)

  return (
    <div className='text-sm h-full overflow-auto p-2'>
      <p className='mb-1'>Snapshot Registry:</p>

      {Object.entries(objectSnapshots).map(([id, snapshot]) => (
        <div key={id} className='mb-2'>
          <p className='mb-1'>{id}:</p>

          <pre className='border rounded border-ui-750 bg-ui-900 p-2 overflow-auto whitespace-pre-wrap'>
            {JSON.stringify(snapshot, null, 2)}
          </pre>
        </div>
      ))}
    </div>
  )
}