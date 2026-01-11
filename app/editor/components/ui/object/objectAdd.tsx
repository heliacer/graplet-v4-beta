import { useObjectActions } from '@/app/editor/lib/hooks/useObjectActions'
import { createAddItemsMenu } from '@/app/editor/lib/utils/addItems'
import { Dropdown } from '@/app/ui/components/Dropdown'
import { DiamondPlus } from 'lucide-react'

export function ObjectAdd() {
  const { addObject } = useObjectActions()
  const items = createAddItemsMenu(addObject)

  return <Dropdown label='Add' Icon={DiamondPlus} items={items} />
}
