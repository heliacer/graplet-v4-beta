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
  /** @todo pass {i} so that the child dropdown knows where to allocate, using spacing of i*child height */
  return (
    <ul>
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
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      <button
        className='flex gap-1 items-center'
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
      <div className='absolute left-full top-1/2'>
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
      <div ref={refClick} className='text-sm relative'>
        <button
          onClick={() => setIsOpen(prev => !prev)}
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
        {items && isOpen && <DropdownItemList items={items} />}
      </div>
    </DropdownContext.Provider>
  )
}
