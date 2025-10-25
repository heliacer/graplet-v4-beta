import { useEditor } from '@/app/editor/lib/EditorContext'
import {
  DropdownButton,
  DropdownContent,
  DropdownMenu,
  DropdownOption,
  DropdownFolder
} from '@/app/ui/components/Dropdown'
import clsx from 'clsx'
import {
  Box,
  ChevronDown,
  Component,
  Hammer,
  LampDesk,
  ScanEye,
  Video
} from 'lucide-react'
import {
  BoxGeometry,
  BufferGeometry,
  CircleGeometry,
  CylinderGeometry,
  DodecahedronGeometry,
  Group,
  IcosahedronGeometry,
  Mesh,
  MeshStandardMaterial,
  OctahedronGeometry,
  Object3D,
  PlaneGeometry,
  RingGeometry,
  SphereGeometry,
  TetrahedronGeometry,
  TorusGeometry,
  TorusKnotGeometry,
  ConeGeometry
} from 'three'

export default function Ribbon() {
  const { currentObject, setObjectVersion } = useEditor()

  function addObject(object: Object3D, name: string) {
    object.name = name
    currentObject?.add(object)
    setObjectVersion((previous) => previous + 1)
  }

  function addMesh(geometry: BufferGeometry, name: string) {
    const mesh = new Mesh(
      geometry,
      new MeshStandardMaterial({ color: '#ffffff' })
    )
    addObject(mesh, name)
  }

  function addGroup() {
    const group = new Group()
    group.name = 'Group'
    currentObject?.add(group)
    setObjectVersion((previous) => previous + 1)
  }

  /** this is also bs, needs rework */
  const addBox = () => addMesh(new BoxGeometry(), 'Box')
  const addSphere = () => addMesh(new SphereGeometry(), 'Sphere')
  const addPlane = () => addMesh(new PlaneGeometry(), 'Plane')
  const addCircle = () => addMesh(new CircleGeometry(), 'Circle')
  const addCylinder = () => addMesh(new CylinderGeometry(), 'Cylinder')
  const addCone = () => addMesh(new ConeGeometry(), 'Cone')
  const addRing = () => addMesh(new RingGeometry(), 'Ring')
  const addDodecahedron = () =>
    addMesh(new DodecahedronGeometry(), 'Dodecahedron')
  const addOctahedron = () => addMesh(new OctahedronGeometry(), 'Octahedron')
  const addIcosahedron = () => addMesh(new IcosahedronGeometry(), 'Icosahedron')
  const addTetrahedron = () => addMesh(new TetrahedronGeometry(), 'Tetrahedron')
  const addTorus = () => addMesh(new TorusGeometry(), 'Torus')
  const addTorusKnot = () => addMesh(new TorusKnotGeometry(), 'TorusKnot')

  const meshItems = [
    { label: 'Box', action: addBox },
    { label: 'Sphere', action: addSphere },
    { label: 'Plane', action: addPlane },
    { label: 'Circle', action: addCircle },
    { label: 'Cylinder', action: addCylinder },
    { label: 'Cone', action: addCone },
    { label: 'Ring', action: addRing },
    { label: 'Dodecahedron', action: addDodecahedron },
    { label: 'Octahedron', action: addOctahedron },
    { label: 'Icosahedron', action: addIcosahedron },
    { label: 'Tetrahedron', action: addTetrahedron },
    { label: 'Torus', action: addTorus },
    { label: 'TorusKnot', action: addTorusKnot }
  ]

  return (
    <div role="menu" className="flex gap-1 items-center p-1">
      <DropdownMenu className="text-sm">
        <DropdownButton
          disabled={!currentObject || currentObject.type !== 'Group'}
          className={(isOpen, disabled) => clsx(
            'flex items-center gap-1 border border-transparent rounded-md px-1',
            disabled
              ? 'text-zinc-400'
              : 'cursor-pointer hover:bg-zinc-800 hover:border-zinc-700',
            isOpen && 'bg-zinc-800 border-zinc-700',
          )}
        >
          <Box size={16} />
          <p>Add</p>
          <ChevronDown size={16} />
        </DropdownButton>
        <DropdownContent align="left">
          <DropdownOption onClick={addGroup}>
            <Component size={16} />
            <p>Group</p>
          </DropdownOption>
          <DropdownFolder label="Mesh" icon={<Box size={16} />}>
            {meshItems.map(({ label, action }) => (
              <DropdownOption key={label} onClick={action}>
                <p>{label}</p>
              </DropdownOption>
            ))}
          </DropdownFolder>
          <DropdownFolder icon={<LampDesk size={16} />} label="Light">
            <DropdownOption>
              <p>Point Light</p>
            </DropdownOption>
          </DropdownFolder>
          <DropdownFolder label="Camera" icon={<Video size={16} />}>
            <DropdownOption>
              <p>Perspective Camera</p>
            </DropdownOption>
          </DropdownFolder>
        </DropdownContent>
      </DropdownMenu>
      <DropdownMenu className='text-sm'>
        <DropdownButton
          disabled={!currentObject || currentObject.type !== 'Group'}
          className={(isOpen, disabled) => clsx(
            'flex items-center gap-1 border border-transparent rounded-md px-1',
            disabled
              ? 'text-zinc-400'
              : 'cursor-pointer hover:bg-zinc-800 hover:border-zinc-700',
            isOpen && 'bg-zinc-800 border-zinc-700',
          )}
        >
          <ScanEye size={16} />
          <p>View</p>
          <ChevronDown size={16} />
        </DropdownButton>
      </DropdownMenu>
      <DropdownMenu className='text-sm'>
        <DropdownButton
          disabled={!currentObject || currentObject.type !== 'Group'}
          className={(isOpen, disabled) => clsx(
            'flex items-center gap-1 border border-transparent rounded-md px-1',
            disabled
              ? 'text-zinc-400'
              : 'cursor-pointer hover:bg-zinc-800 hover:border-zinc-700',
            isOpen && 'bg-zinc-800 border-zinc-700',
          )}
        >
          <Hammer size={16} />
          <p>Actions</p>
          <ChevronDown size={16} />
        </DropdownButton>
      </DropdownMenu>
    </div>
  )
}
