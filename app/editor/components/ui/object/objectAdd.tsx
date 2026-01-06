import { useObjectActions } from '@/app/editor/lib/hooks/useObjectActions'
import { SGeometryT } from '@/app/editor/lib/types'
import { Dropdown, DropdownItemProps } from '@/app/ui/components/Dropdown'
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

/** might wanna expose this, idk */
type LightT = 'AmbientLight' | 'DirectionalLight'
type CameraT = 'PerspectiveCamera' | 'OrthographicCamera'

const lights: LightT[] = ['AmbientLight', 'DirectionalLight']

const cameras: CameraT[] = ['PerspectiveCamera', 'OrthographicCamera']

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

  const lightChildren: DropdownItemProps[] = lights.map((light) => ({
    label: light,
    onClick: () =>
      addObject({
        name: light,
        type: light
      })
  }))

  const cameraChildren: DropdownItemProps[] = cameras.map((camera) => ({
    label: camera,
    onClick: () =>
      addObject({
        name: camera,
        type: camera,
        position: [0, 0, 10]
      })
  }))

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
