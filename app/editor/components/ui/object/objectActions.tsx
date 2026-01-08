import { Dropdown, DropdownItemProps } from '@/app/ui/components/Dropdown'
import { ArrowDownToDot, Hammer } from 'lucide-react'
import { Object3D } from 'three'

export function ObjectActions({ object }: { object: Object3D }) {
  const items: DropdownItemProps[] = [
    {
      label: 'Center Object',
      Icon: ArrowDownToDot,
      onClick: () => {
        object.position.set(0, 0, 0)
      }
    }
  ]

  return <Dropdown Icon={Hammer} label='Actions' items={items} />
}
