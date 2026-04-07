import { useEditorStore } from '@/app/editor/lib/state'
import { upsertPanel } from '@/app/editor/lib/utils/dockview'
import { Dropdown, DropdownItemProps } from '@/app/ui/components/Dropdown'
import { Keyboard, PenLine } from 'lucide-react'

export function EditMenu() {
  const dvApi = useEditorStore(s => s.dvApi)

  /**
   * @todo Implement Edit menu
   * - undo / redo (oh boy)
   * - keybinds
   */

  const items: DropdownItemProps[] = [
    {
      label: 'Keybinds ...',
      Icon: Keyboard,
      onClick: () => upsertPanel(dvApi, 'keybinds', 'Keybinds', 'Keyboard')
    }
  ]

  return <Dropdown label='Edit' Icon={PenLine} items={items} />
}
