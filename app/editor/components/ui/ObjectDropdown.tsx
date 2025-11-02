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
import { useObjectActions } from '../../lib/hooks/useObjectActions'
import { SGeometryT } from '../../lib/types'
import { Object3D } from 'three'

interface ObjectDropdownProps {
  target?: Object3D
  buttonStyle: (isOpen: boolean, disabled?: boolean | undefined) => string
  disabled?: boolean
  side?: 'top' | 'bottom'
  folderSide?: 'top' | 'bottom'
}

export function ObjectDropdown({
  target,
  buttonStyle,
  disabled,
  side,
  folderSide
}: ObjectDropdownProps) {
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
      <DropdownButton className={buttonStyle} disabled={disabled}>
        <DiamondPlus size={14} />
        <p>Add</p>
        <ChevronDown size={14} />
      </DropdownButton>
      <DropdownContent align="left" side={side}>
        <DropdownOption
          onClick={() => addObject({ type: 'Group', name: 'Group' }, target)}
        >
          <Component size={14} />
          <p>Group</p>
        </DropdownOption>
        <DropdownFolder label="Mesh" side={folderSide} icon={<Box size={14} />}>
          {geometries.map((geometryType) => (
            <DropdownOption
              key={geometryType}
              onClick={() => {
                addObject(
                  {
                    name: geometryType.slice(0, -8),
                    type: 'Mesh',
                    geometry: { type: geometryType, args: [] },
                    material: { type: 'MeshStandardMaterial' }
                  },
                  target
                )
              }}
            >
              {geometryType.slice(0, -8)}
            </DropdownOption>
          ))}
        </DropdownFolder>
        <DropdownFolder
          label="Light"
          side={folderSide}
          icon={<Lightbulb size={14} />}
        >
          <DropdownOption
            onClick={() => {
              addObject(
                {
                  type: 'AmbientLight',
                  name: 'Ambient Light'
                },
                target
              )
            }}
          >
            <p>Ambient Light</p>
          </DropdownOption>
          <DropdownOption
            onClick={() => {
              addObject(
                {
                  type: 'DirectionalLight',
                  name: 'Directional Light'
                },
                target
              )
            }}
          >
            <p>Directional Light</p>
          </DropdownOption>
        </DropdownFolder>
        <DropdownFolder
          label="Camera"
          side={folderSide}
          icon={<Camera size={14} />}
        >
          <DropdownOption
            onClick={() => {
              addObject(
                {
                  type: 'PerspectiveCamera',
                  name: 'Perspective Camera',
                  position: [0, 0, 10]
                },
                target
              )
            }}
          >
            <p>Perspective Camera</p>
          </DropdownOption>
          <DropdownOption
            onClick={() => {
              addObject(
                {
                  type: 'OrthographicCamera',
                  name: 'Orthographic Camera',
                  position: [0, 0, 10]
                },
                target
              )
            }}
          >
            <p>Orthographic Camera</p>
          </DropdownOption>
        </DropdownFolder>
      </DropdownContent>
    </DropdownMenu>
  )
}
