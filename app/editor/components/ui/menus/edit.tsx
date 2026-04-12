import { useEditorStore } from '@/app/editor/lib/state'
import { Dropdown, DropdownItemProps } from '@/app/ui/components/Dropdown'
import { PenLine } from 'lucide-react'

export function EditMenu() {
  const dvApi = useEditorStore(s => s.dvApi)

  /** @todo (#62) Edit Menu */

  const items: DropdownItemProps[] = [
    {
      label: 'Undo'
    },
    {
      label: 'Redo'
    }
  ]

  return <Dropdown label='Edit' Icon={PenLine} items={items} />
}
