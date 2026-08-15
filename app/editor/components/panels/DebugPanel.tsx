import { useEditorStore } from '../../state'

export default function DebugPanel() {
  const objectSnapshots = useEditorStore(s => s.objectSnapshots)

  return (
    <div className='text-sm h-full overflow-auto p-2'>
      <p className='mb-1'>Snapshot Logs:</p>

      {Object.entries(objectSnapshots).map(([id, snapshot]) => (
        <div key={id} className='mb-2 flex gap-2 items-center'>
          <p className='text-ui-400'>{id}</p>
          <p>name:</p>
          <code className='border rounded border-ui-750 bg-ui-900 px-1 text-teal'>
            {snapshot.name}
          </code>
          <p>parentId:</p>
          <code className='border rounded border-ui-750 bg-ui-900 px-1 text-amber'>
            {snapshot.parentId || 'undefined'}
          </code>
          <p>childIds:</p>
          <code className='border rounded border-ui-750 bg-ui-900 px-1'>
            {snapshot.childIds.join(',')}
          </code>
        </div>
      ))}
    </div>
  )
}
