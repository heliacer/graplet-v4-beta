import { useEditor } from '@/app/editor/lib/EditorContext'
import { Dropdown, DropdownItemProps } from '@/app/ui/components/Dropdown'
import { Keyboard, PenLine } from 'lucide-react'

export function EditMenu() {
  const { dvApi } = useEditor()

  /**
   * @todo Implement Edit menu
   * - undo / redo (oh boy)
   * - keybinds
   */

  const items: DropdownItemProps[] = [
    {
      label: 'Keybinds ...',
      Icon: Keyboard,
      onClick: () => {
        const panel = dvApi?.getPanel('keybinds')
        if (panel) {
          panel.api.setActive()
        } else {
          dvApi?.addPanel({
            id: 'keybinds',
            component: 'keybinds',
            title: 'Keybinds',
            params: {
              iconType: 'Keyboard',
              closable: true
            },
            floating: {
              x: document.body.clientWidth / 2 - 450,
              y: document.body.clientHeight / 2 - 320,
              width: 900,
              height: 550
            }
          })
        }
      }
    }
  ]

  return <Dropdown label='Edit' Icon={PenLine} items={items} />
}
