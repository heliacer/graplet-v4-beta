import { useEditor } from '@/app/editor/lib/EditorContext'
import {
  DropdownButton,
  DropdownContent,
  DropdownMenu,
  DropdownOption
} from '@/app/ui/components/Dropdown'
import { Box, ChevronDown, Component, Hammer, ScanEye } from 'lucide-react'
import { Group, Mesh, MeshStandardMaterial, SphereGeometry } from 'three'

export default function Ribbon() {
  const { currentObject, setObjectVersion } = useEditor()

  function addBall() {
    const mesh = new Mesh(
      new SphereGeometry(1, 10, 10),
      new MeshStandardMaterial({ color: '#ffffff' })
    )
    mesh.name = 'Sphere'
    mesh.position.set(Math.random() * 3, Math.random() * 3, Math.random() * 3)
    currentObject?.add(mesh)
    setObjectVersion((p) => p + 1)
  }

  function addGroup() {
    const group = new Group()
    group.name = 'Group'
    currentObject?.add(group)
    setObjectVersion((p) => p + 1)
  }
  return (
    <div className="flex gap-1 items-center w-full h-full mx-1">
      <DropdownMenu className="text-sm rounded-md">
        <DropdownButton>
          <Box size={16} />
          <p>Add</p>
          <ChevronDown size={16} />
        </DropdownButton>
        <DropdownContent align="left">
          <DropdownOption onClick={addGroup}>
            <Component size={16} />
            <p>Group</p>
          </DropdownOption>
          <DropdownOption onClick={addBall}>
            <p>Mesh</p>
          </DropdownOption>
          <DropdownOption>
            <p>Light</p>
          </DropdownOption>
          <DropdownOption>
            <p>Camera</p>
          </DropdownOption>
        </DropdownContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownButton className="text-sm rounded-md">
          <ScanEye size={16} />
          <p>View</p>
          <ChevronDown size={16} />
        </DropdownButton>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownButton className="text-sm rounded-md">
          <Hammer size={16} />
          <p>Actions</p>
          <ChevronDown size={16} />
        </DropdownButton>
      </DropdownMenu>
    </div>
  )
}
