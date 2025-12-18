import clsx from 'clsx'
import { ChevronDown, LucideIcon } from 'lucide-react'

export interface DropdownItemProps {
  label: string
  Icon?: LucideIcon
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  children?: DropdownItemProps[]
}

export interface DropdownProps {
  label: string
  items?: DropdownItemProps[]
  Icon?: LucideIcon
  size?: number
}

function DropdownItem({ label, Icon, onClick, children }: DropdownItemProps) {
  return (
    <li className='flex gap-1'>
      {Icon && <Icon size={14} />}
      {label}
    </li>
  )
}

/**
 * New Dropdown - REVAMP UI
 *
 * @todo clsx (order revamp soon) [spacing, looks, color [border, bg]]
 * @todo mechanics, open/close + folders, maybe make them merged into one activeItems, setActiveItems
 */
export function Dropdown({ label, items, Icon, size }: DropdownProps) {
  return (
    <div className='text-sm relative'>
      <button
        className={clsx(
          'flex items-center gap-1 px-1',
          'border rounded-md',
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
            <DropdownItem key={i} {...child} />
          ))}
        </ul>
      )}
    </div>
  )
}
