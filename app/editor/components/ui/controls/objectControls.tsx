import { useEditor } from '@/app/editor/lib/EditorContext'
import { ObjectActions } from '../object/objectActions'
import { ObjectAdd } from '../object/objectAdd'
import { ObjectSnap } from '../object/objectSnap'
import { ObjectTools } from '../object/objectTools'
import { ObjectView } from '../object/objectView'

export function ObjectControls() {
  const { currentObject } = useEditor()
  return (
    <div className='flex gap-2 absolute m-1.5'>
      <ObjectTools />
      <ObjectAdd />
      <ObjectView />
      {currentObject && <ObjectActions object={currentObject} />}
      <ObjectSnap />
    </div>
  )
}
