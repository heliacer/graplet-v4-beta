import { Dropdown, DropdownItemProps } from '@/app/ui/components/Newdropdown'
import { ObjectAdd } from '../object/objectAdd'
import { ObjectTools } from '../object/objectTools'
import { Component, DiamondPlus, Star } from 'lucide-react'

export function ObjectControls() {
  const items: DropdownItemProps[] = [
    {
      label: 'Group',
      Icon: Component
    },
    {
      label: 'Action',
      Icon: Star
    }
  ]


  return (
    <div className='flex gap-2 absolute m-1.5'>
      <ObjectTools />
      <nav>
        <ObjectAdd />
      </nav>
      <Dropdown label='Add' Icon={DiamondPlus} items={items} />
    </div>
  )
}
