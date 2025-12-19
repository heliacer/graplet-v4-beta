import clsx from 'clsx'
import { ChevronDown, ChevronRight, LucideIcon } from 'lucide-react'
import React, { createContext, useContext, useState } from 'react'
import { useClickOutside } from '../hooks/useClickOutside'

interface DropdownContextType {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const DropdownContext = createContext<DropdownContextType>(null!)

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

function DropdownItemList({ items }: { items: DropdownItemProps[] }) {
  return (
    <ul className='text-xs bg-zinc-800 border border-zinc-700 rounded py-0.5'>
      {items.map((item, i) => (
        <DropdownItem key={i} {...item} />
      ))}
    </ul>
  )
}

function DropdownItem({ label, Icon, onClick, children }: DropdownItemProps) {
  const { setIsOpen } = useContext(DropdownContext)
  const [active, setActive] = useState(false)

  return (
    <li
      className='relative'
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      <div className='mx-0.5'>
        <button
          className={clsx(
            'flex gap-1 px-0.5 items-center w-full',
            'rounded border border-transparent',
            'hover:bg-zinc-700 hover:border-zinc-600',
          )}
          onClick={(e) => {
            onClick?.(e)
            if (!children) {
              setIsOpen(false)
            }
          }}
        >
          {Icon && <Icon size={14} />}
          {label}
          {children && <ChevronRight size={14} />}
        </button>
      </div>
      <div className='absolute left-full top-0'>
        {children && active && <DropdownItemList items={children} />}
      </div>
    </li>
  )
}

/**
 * New Dropdown - REVAMP UI
 *
 * @todo clsx (order revamp soon) [spacing, looks, color [border, bg]]
 * @todo mechanics, open/close + folders, maybe make them merged into one activeItems, setActiveItems
 */
export function Dropdown({ label, items, Icon }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  const refClick = useClickOutside<HTMLDivElement>(() => {
    setIsOpen(false)
  })

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen }}>
      <div ref={refClick}>
        <button
          onClick={() => setIsOpen(prev => !prev)}
          className={clsx(
            'text-sm flex items-center gap-1 px-1 mb-0.5',
            'border rounded-md',
            'border-zinc-700',
            'hover:bg-zinc-750 bg-zinc-800'
          )}
        >
          {Icon && <Icon size={14} />}
          {label}
          <ChevronDown size={14} />
        </button>
        {items && isOpen && <DropdownItemList items={items} />}
      </div>
    </DropdownContext.Provider>
  )
}
