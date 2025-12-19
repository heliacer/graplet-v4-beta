import { useObjectActions } from '@/app/editor/lib/hooks/useObjectActions'
import { SGeometryT } from '@/app/editor/lib/types'
import { Dropdown, DropdownItemProps } from '@/app/ui/components/Dropdown.test'
import { Box, Camera, Component, DiamondPlus, Lightbulb } from 'lucide-react'

const geometries: SGeometryT[] = [
  'BoxGeometry',
  'CircleGeometry',
  'ConeGeometry',
  'CylinderGeometry',
  'DodecahedronGeometry',
  'IcosahedronGeometry',
  'OctahedronGeometry',
  'PlaneGeometry',
  'RingGeometry',
  'SphereGeometry',
  'TetrahedronGeometry',
  'TorusGeometry',
  'TorusKnotGeometry'
]

export function ObjectAdd() {
  const { addObject } = useObjectActions()

  const meshChildren: DropdownItemProps[] = geometries.map((geo) => ({
    label: geo.slice(0, -8),
    onClick: () =>
      addObject({
        name: geo.slice(0, -8),
        type: 'Mesh',
        geometry: { type: geo, args: [] },
        material: { type: 'MeshStandardMaterial' }
      })
  }))

  const lightChildren: DropdownItemProps[] = []

  const cameraChildren: DropdownItemProps[] = []

  const items: DropdownItemProps[] = [
    {
      label: 'Group',
      Icon: Component,
      onClick: () => addObject({ type: 'Group', name: 'Group' })
    },
    {
      label: 'Mesh',
      Icon: Box,
      children: meshChildren
    },
    {
      label: 'Light',
      Icon: Lightbulb,
      children: lightChildren
    },
    {
      label: 'Camera',
      Icon: Camera,
      children: cameraChildren
    }
  ]

  return <Dropdown label='Add' Icon={DiamondPlus} items={items} />
}
