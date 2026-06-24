import { Dropdown, DropdownItemProps } from '@/app/ui/components/Dropdown'
import { SquareDashed } from 'lucide-react'

export function ObjectSelection() {
  const items: DropdownItemProps[] = [
    {
      label: 'Meshes',
      checked: true,
      onClick: () => {
        /**
         * @todo (#34 Scene UX Controls)
         * -> update selection state
         */
      }
    },
    {
      label: 'Cameras',
      checked: true,
      onClick: () => {
        /** @todo (#34 Scene UX Controls */
      }
    },
    {
      label: 'Lights',
      checked: true,
      onClick: () => {
        /** @todo (#34 Scene UX Controls */
      }
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
