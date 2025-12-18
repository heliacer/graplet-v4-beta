import { useObjectActions } from '@/app/editor/lib/hooks/useObjectActions'
import { Dropdown, DropdownItemProps } from '@/app/ui/components/Dropdown.test'
import { Box, Component, DiamondPlus, Star, Wrench } from 'lucide-react'

export function ObjectAdd() {
  const { addObject } = useObjectActions()

  const items: DropdownItemProps[] = [
    {
      label: 'Group',
      Icon: Component,
      onClick: () => addObject({ type: 'Group', name: 'Group' })
    },
    {
      label: 'Mesh',
      Icon: Box,
      children: [
        {
          label: 'Box',
          onClick: () => addObject({
            name: 'Cube',
            type: 'Mesh',
            geometry: { type: 'BoxGeometry', args: [] },
            material: { type: 'MeshStandardMaterial' }
          })
        },
        {
          label: 'More',
          Icon: Wrench,
          children: [
            {
              label: 'Test',
            },
            {
              label: '???',
              children: [
                {
                  label: 'may26',
                }
              ]
            }
          ]
        }
        /** @todo add map of all geometries, maybe add icon */
      ]
    },
    {
      label: 'Action',
      Icon: Star
    }
  ]

  return <Dropdown label='Add' Icon={DiamondPlus} items={items} />
}