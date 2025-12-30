import { Dropdown } from '@/app/ui/components/Dropdown'
import { PenLine } from 'lucide-react'

export function EditMenu() {
  /**
   * @todo Implement Edit menu
   * - undo / redo (oh boy)
   */
  return <Dropdown label='Edit' Icon={PenLine} />
}
