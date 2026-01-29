import { useEditor } from '@/app/editor/lib/EditorContext'
import { ObjectActions } from '../object/objectActions'
import { ObjectAdd } from '../object/objectAdd'
import { ObjectSnap } from '../object/objectSnap'
import { ObjectTools } from '../object/objectTools'
import { ObjectView } from '../object/objectView'
import { useCurrentObject } from '@/app/editor/lib/hooks/useCurrentObject'

export function ObjectControls() {
  const { isRunning } = useEditor()
  const object = useCurrentObject()

  if (isRunning) return

  return (
    <div className='absolute flex gap-2 m-1.5 pointer-events-none'>
      <ObjectTools />
      <div className='flex gap-2 h-min'>
        <ObjectAdd />
        <ObjectView />
        {object && <ObjectActions object={object} />}
        <ObjectSnap />
      </div>
    </div>
  )
}
