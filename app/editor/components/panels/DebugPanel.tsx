import { useEditorStore } from '../../state'

export default function DebugPanel() {
  const objectSnapshots = useEditorStore(s => s.objectSnapshots)

  return (
    <div className='text-sm h-full overflow-auto p-2'>
      <p className='mb-1'>Snapshot Registry:</p>
      {Object.entries(objectSnapshots).map(([id, snapshot]) => (
        <div key={id} className='flex gap-4'>
          <p>{id}:</p>
          <code className='border rounded border-ui-750 bg-ui-900'>
            {JSON.stringify(snapshot, null, 2)}
          </code>
        </div>
      ))}
    </div>
  )
}
