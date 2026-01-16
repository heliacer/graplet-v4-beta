import { ObjectActions } from '../object/objectActions'
import { ObjectAdd } from '../object/objectAdd'
import { ObjectSnap } from '../object/objectSnap'
import { ObjectTools } from '../object/objectTools'
import { ObjectView } from '../object/objectView'
import { useCurrentObject } from '@/app/editor/lib/hooks/useCurrentObject'

export function ObjectControls() {
  const object = useCurrentObject()

  return (
    <div className='flex gap-2 absolute m-1.5'>
      <ObjectTools />
      <ObjectAdd />
      <ObjectView />
      {object && <ObjectActions object={object} />}
      <ObjectSnap />
    </div>
  )
}
