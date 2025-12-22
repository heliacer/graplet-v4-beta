import { Dropdown, DropdownItemProps } from '@/app/ui/components/Dropdown'
import { Cctv, Grid2x2, Rows2, Spotlight } from 'lucide-react'

export function ObjectView() {
  const items: DropdownItemProps[] = [
    {
      label: 'Light Helper',
      Icon: Spotlight
    },
    {
      label: 'Camera Helper',
      Icon: Cctv
    },
    {
      label: 'Grid Helper',
      Icon: Grid2x2
    }
  ]

  return <Dropdown Icon={Rows2} label='View' items={items} />
}
