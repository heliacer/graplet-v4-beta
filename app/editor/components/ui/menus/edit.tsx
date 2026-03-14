import { useEditor } from '@/app/editor/lib/EditorContext'
import { upsertPanel } from '@/app/editor/lib/utils/dockview'
import { Dropdown, DropdownItemProps } from '@/app/ui/components/Dropdown'
import { Keyboard, PenLine, Settings2 } from 'lucide-react'

export function EditMenu() {
  const { dvApi } = useEditor()

  if (!dvApi) return

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
    },
    {
      label: 'Settings ...',
      Icon: Settings2,
      onClick: () => upsertPanel(dvApi, 'settings', 'Settings', 'Settings2')
    }
  ]

  return <Dropdown label='Edit' Icon={PenLine} items={items} />
}
