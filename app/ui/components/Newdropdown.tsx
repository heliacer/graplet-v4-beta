import clsx from 'clsx'
import { ChevronDown, LucideIcon } from 'lucide-react'

interface DropdownItem {
  label: string
  Icon?: LucideIcon
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  children?: DropdownItem[]
}

interface DropdownProps {
  label: string
  items?: DropdownItem[]
  Icon?: LucideIcon
  size?: number
}
/**
 * New Dropdown - REVAMP UI
 *
 * @todo clsx (order revamp soon) [spacing, looks, color [border, bg]]
 */
export function Dropdown({ label, items, Icon, size }: DropdownProps) {
  return (
    <div className='relative'>
      <button
        className={clsx(
          'flex items-center gap-1 px-1',
          'text-sm border rounded-md',
          'border-zinc-700',
          'hover:bg-zinc-750 bg-zinc-800'
        )}
      >
        {Icon && <Icon size={14} />}
        {label}
        <ChevronDown size={14} />
      </button>
      {items && (
        <ul>
          {items.map((child, i) => (
            <li key={i}>{child.label}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
