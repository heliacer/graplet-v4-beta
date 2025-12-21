import { ObjectAdd } from '../object/objectAdd'
import { ObjectTools } from '../object/objectTools'

export function ObjectControls() {
  return (
    <div className='flex gap-2 absolute m-1.5'>
      <ObjectTools />
      <ObjectAdd />
    </div>
  )
}
