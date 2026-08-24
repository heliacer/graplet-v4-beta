import { useEditorStore } from '@/app/editor/state'
import { Dropdown, DropdownItemProps } from '@/app/lib/components/Dropdown'
import { SquareDashed } from 'lucide-react'

export function ObjectSelection() {
  const { meshes, cameras, lights } = useEditorStore(s => s.objectSelections)
  const toggleObjectSelection = useEditorStore(s => s.toggleObjectSelection)

  const items: DropdownItemProps[] = [
    {
      label: 'Meshes',
      checked: meshes,
      onClick: () => toggleObjectSelection('meshes')
    },
    {
      label: 'Cameras',
      checked: cameras,
      onClick: () => toggleObjectSelection('cameras')
    },
    {
      label: 'Lights',
      checked: lights,
      onClick: () => toggleObjectSelection('lights')
    }
    /** ... */
  ]

  return (
    <Dropdown
      label='Selection'
      Icon={SquareDashed}
      items={items}
      iconStyle='text-green'
    />
  )
}
