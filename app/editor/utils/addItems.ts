import { DropdownItemProps } from '@/app/ui/components/Dropdown'
import { SGeometryT, SObjectConfig } from '../types'
import { Box, Camera, Component, Lightbulb } from 'lucide-react'
import { Object3D } from 'three'

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

type LightT = 'AmbientLight' | 'DirectionalLight'
type CameraT = 'PerspectiveCamera' | 'OrthographicCamera'

const lights: LightT[] = ['AmbientLight', 'DirectionalLight']

const cameras: CameraT[] = ['PerspectiveCamera', 'OrthographicCamera']

/**
 * @returns a list of dropdown items with all common object add options
 */
export function createAddItemsMenu(
  addObject: (props: SObjectConfig, targetId?: string) => Object3D,
  targetId?: string
) {
  const meshChildren: DropdownItemProps[] = geometries.map(geo => ({
    label: geo.slice(0, -8),
    onClick: () =>
      addObject(
        {
          name: geo.slice(0, -8),
          type: 'Mesh',
          geometry: { type: geo, args: [] },
          material: { type: 'MeshStandardMaterial' }
        },
        targetId
      )
  }))

  const lightChildren: DropdownItemProps[] = lights.map(light => ({
    label: light,
    onClick: () =>
      addObject(
        {
          name: light,
          type: light
        },
        targetId
      )
  }))

  const cameraChildren: DropdownItemProps[] = cameras.map(camera => ({
    label: camera,
    onClick: () =>
      addObject(
        {
          name: camera,
          type: camera,
          position: [0, 0, 10]
        },
        targetId
      )
  }))

  const items: DropdownItemProps[] = [
    {
      label: 'Group',
      Icon: Component,
      onClick: () => addObject({ type: 'Group', name: 'Group' }, targetId)
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

  return items
}
