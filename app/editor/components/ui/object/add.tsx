import {
  DropdownButton,
  DropdownContent,
  DropdownFolder,
  DropdownMenu,
  DropdownOption
} from '@/app/ui/components/Dropdown'
import {
  Box,
  Camera,
  ChevronDown,
  Component,
  DiamondPlus,
  Lightbulb
} from 'lucide-react'
import { useObjectActions } from '../../../lib/hooks/useObjectActions'
import { SGeometryT } from '../../../lib/types'
import clsx from 'clsx'

export function ObjectAdd() {
  const { addObject } = useObjectActions()

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

  return (
    <DropdownMenu>
      <DropdownButton
        className={(isOpen) =>
          clsx(
            'flex items-center gap-1 px-1',
            isOpen ? 'bg-zinc-750' : 'hover:bg-zinc-750 bg-zinc-800',
            'border rounded-md text-sm border-zinc-700 cursor-pointer'
          )
        }
      >
        <DiamondPlus size={14} />
        <p>Add</p>
        <ChevronDown size={14} />
      </DropdownButton>
      <DropdownContent align="left" side="bottom">
        <DropdownOption
          onClick={() => addObject({ type: 'Group', name: 'Group' })}
        >
          <Component size={14} />
          <p>Group</p>
        </DropdownOption>
        <DropdownFolder label="Mesh" side="top" icon={<Box size={14} />}>
          {geometries.map((geometryType) => (
            <DropdownOption
              key={geometryType}
              onClick={() => {
                addObject({
                  name: geometryType.slice(0, -8),
                  type: 'Mesh',
                  geometry: { type: geometryType, args: [] },
                  material: { type: 'MeshStandardMaterial' }
                })
              }}
            >
              {geometryType.slice(0, -8)}
            </DropdownOption>
          ))}
        </DropdownFolder>
        <DropdownFolder label="Light" side="top" icon={<Lightbulb size={14} />}>
          <DropdownOption
            onClick={() => {
              addObject({
                type: 'AmbientLight',
                name: 'Ambient Light'
              })
            }}
          >
            <p>Ambient Light</p>
          </DropdownOption>
          <DropdownOption
            onClick={() => {
              addObject({
                type: 'DirectionalLight',
                name: 'Directional Light'
              })
            }}
          >
            <p>Directional Light</p>
          </DropdownOption>
        </DropdownFolder>
        <DropdownFolder label="Camera" side="top" icon={<Camera size={14} />}>
          <DropdownOption
            onClick={() => {
              addObject({
                type: 'PerspectiveCamera',
                name: 'Perspective Camera',
                position: [0, 0, 10]
              })
            }}
          >
            <p>Perspective Camera</p>
          </DropdownOption>
          <DropdownOption
            onClick={() => {
              addObject({
                type: 'OrthographicCamera',
                name: 'Orthographic Camera',
                position: [0, 0, 10]
              })
            }}
          >
            <p>Orthographic Camera</p>
          </DropdownOption>
        </DropdownFolder>
      </DropdownContent>
    </DropdownMenu>
  )
}
