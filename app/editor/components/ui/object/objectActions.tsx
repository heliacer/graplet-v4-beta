import { useObjectActions } from '@/app/editor/lib/hooks/useObjectActions'
import { Dropdown, DropdownItemProps } from '@/app/ui/components/Dropdown'
import { ArrowDownToDot, Hammer, Layers2 } from 'lucide-react'
import { Object3D } from 'three'

export function ObjectActions({ object }: { object: Object3D }) {
  const { duplicateObject } = useObjectActions()

  const items: DropdownItemProps[] = [
    {
      label: 'Center Object',
      Icon: ArrowDownToDot,
      onClick: () => {
        object.position.set(0, 0, 0)
      }
    },
    {
      label: 'Duplicate Object',
      Icon: Layers2,
      onClick: () => duplicateObject(object)
    }
  ]

  return <Dropdown Icon={Hammer} label='Actions' items={items} />
}
