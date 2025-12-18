import { ObjectAdd } from '../object/objectAdd.test'
import { ObjectAdd as ObjectAddOld } from '../object/objectAdd'
import { ObjectTools } from '../object/objectTools'

export function ObjectControls() {
  return (
    <div className='flex gap-2 absolute m-1.5'>
      <ObjectTools />
      <nav>
        <ObjectAddOld />
      </nav>
      <ObjectAdd />
    </div>
  )
}
