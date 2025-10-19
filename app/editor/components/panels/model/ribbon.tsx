import { useEditor } from '@/app/editor/lib/EditorContext'
import {
  DropdownButton,
  DropdownContent,
  DropdownMenu,
  DropdownOption,
  DropdownFolder
} from '@/app/ui/components/Dropdown'
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
  CapsuleGeometry,
  CatmullRomCurve3,
  CircleGeometry,
  CylinderGeometry,
  DodecahedronGeometry,
  Group,
  IcosahedronGeometry,
  LatheGeometry,
  Mesh,
  MeshStandardMaterial,
  OctahedronGeometry,
  Object3D,
  PlaneGeometry,
  RingGeometry,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  TetrahedronGeometry,
  TorusGeometry,
  TorusKnotGeometry,
  TubeGeometry,
  Vector2,
  Vector3
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

  const addBox = () => addMesh(new BoxGeometry(1, 1, 1), 'Box')
  const addSphere = () => addMesh(new SphereGeometry(1, 16, 16), 'Sphere')
  const addCapsule = () =>
    addMesh(new CapsuleGeometry(0.5, 1, 8, 16), 'Capsule')
  const addCircle = () => addMesh(new CircleGeometry(1, 32), 'Circle')
  const addCylinder = () =>
    addMesh(new CylinderGeometry(0.6, 0.6, 2, 32), 'Cylinder')
  const addDodecahedron = () =>
    addMesh(new DodecahedronGeometry(1), 'Dodecahedron')
  const addIcosahedron = () =>
    addMesh(new IcosahedronGeometry(1, 0), 'Icosahedron')
  const addLathe = () => {
    const points = Array.from({ length: 10 }, (_, index) => {
      const angle = (index / 9) * Math.PI
      return new Vector2(Math.sin(angle) * 0.5 + 0.5, index * 0.2 - 1)
    })
    addMesh(new LatheGeometry(points, 24), 'Lathe')
  }
  const addOctahedron = () => addMesh(new OctahedronGeometry(1), 'Octahedron')
  const addPlane = () => addMesh(new PlaneGeometry(2, 2), 'Plane')
  const addRing = () => addMesh(new RingGeometry(0.6, 1, 32), 'Ring')
  const addTetrahedron = () =>
    addMesh(new TetrahedronGeometry(1), 'Tetrahedron')
  const addTorus = () => addMesh(new TorusGeometry(1, 0.3, 16, 32), 'Torus')
  const addTorusKnot = () =>
    addMesh(new TorusKnotGeometry(0.8, 0.3, 128, 32), 'TorusKnot')
  const addTube = () => {
    const path = new CatmullRomCurve3([
      new Vector3(-1, 0, 0),
      new Vector3(-0.5, 1, 0.5),
      new Vector3(0.5, -1, 0),
      new Vector3(1, 0, 0.5)
    ])
    addMesh(new TubeGeometry(path, 64, 0.2, 12, false), 'Tube')
  }

  const addSprite = () => {
    const sprite = new Sprite(new SpriteMaterial({ color: '#ffffff' }))
    addObject(sprite, 'Sprite')
  }

  const meshItems = [
    { label: 'Box', action: addBox },
    { label: 'Capsule', action: addCapsule },
    { label: 'Circle', action: addCircle },
    { label: 'Cylinder', action: addCylinder },
    { label: 'Dodecahedron', action: addDodecahedron },
    { label: 'Icosahedron', action: addIcosahedron },
    { label: 'Lathe', action: addLathe },
    { label: 'Octahedron', action: addOctahedron },
    { label: 'Plane', action: addPlane },
    { label: 'Ring', action: addRing },
    { label: 'Sphere', action: addSphere },
    { label: 'Sprite', action: addSprite },
    { label: 'Tetrahedron', action: addTetrahedron },
    { label: 'Torus', action: addTorus },
    { label: 'TorusKnot', action: addTorusKnot },
    { label: 'Tube', action: addTube }
  ]

  return (
    <div role="menu" className="flex gap-1 items-center p-1">
      <DropdownMenu className="text-sm">
        <DropdownButton disabled={!currentObject} className="rounded-md">
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
      <DropdownMenu>
        <DropdownButton
          disabled={!currentObject}
          className="text-sm rounded-md"
        >
          <ScanEye size={16} />
          <p>View</p>
          <ChevronDown size={16} />
        </DropdownButton>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownButton
          disabled={!currentObject}
          className="text-sm rounded-md"
        >
          <Hammer size={16} />
          <p>Actions</p>
          <ChevronDown size={16} />
        </DropdownButton>
      </DropdownMenu>
    </div>
  )
}
