import { Dropdown } from '@/app/ui/components/Newdropdown'
import { ObjectAdd } from '../object/objectAdd'
import { ObjectTools } from '../object/objectTools'
import { DiamondPlus } from 'lucide-react'

export function ObjectControls() {
  return (
    <div className='flex gap-2 absolute m-1.5'>
      <ObjectTools />
      <nav>
        <ObjectAdd />
      </nav>
      <Dropdown label='Add' Icon={DiamondPlus} />
    </div>
  )
}
