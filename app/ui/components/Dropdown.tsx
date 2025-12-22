import clsx from 'clsx'
import { ChevronDown, ChevronRight, LucideIcon } from 'lucide-react'
import React, { createContext, useContext, useState } from 'react'
import { useClickOutside } from '../hooks/useClickOutside'

/** Helper func to check whether a folder path is in the active path or not */
function isActiveFolder(fp: number[], ap: number[]) {
  return fp.length <= ap.length && fp.every((v, i) => v === ap[i])
}

interface DropdownContextType {
  isOpen: boolean
  activePath: number[]
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  setActivePath: React.Dispatch<React.SetStateAction<number[]>>
}

const DropdownContext = createContext<DropdownContextType>(null!)

/**
 * Props that go into each dropdown item (including nested)
 */
export interface DropdownItemProps {
  label: string
  Icon?: LucideIcon
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  children?: DropdownItemProps[]
}

/**
 * Props that go in the topmost dropdown
 */
export interface DropdownProps {
  label: string
  items?: DropdownItemProps[]
  Icon?: LucideIcon
  size?: number
}

function DropdownItemList({
  items,
  path = []
}: {
  items: DropdownItemProps[]
  path?: number[]
}) {
  return (
    <ul className='absolute z-999 mt-0.5 text-xs bg-ui-800 border border-ui-700 rounded py-0.5'>
      {items.map((item, i) => (
        <DropdownItem key={i} path={[...path, i]} {...item} />
      ))}
    </ul>
  )
}

function DropdownItem({
  path,
  label,
  Icon,
  onClick,
  children
}: DropdownItemProps & { path: number[] }) {
  const { activePath, setIsOpen, setActivePath } = useContext(DropdownContext)
  const isActive = isActiveFolder(path, activePath)

  return (
    <li
      title={`${path}`}
      className='relative'
      onMouseEnter={() => setActivePath(path)}
    >
      <div className='mx-0.5'>
        <button
          className={clsx(
            'flex gap-1 px-0.5 items-center w-full text-nowrap',
            'rounded border',
            isActive ? 'bg-ui-700 border-ui-600' : 'border-transparent',
            'hover:bg-ui-700 hover:border-ui-600'
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
          {children && <ChevronRight className='ml-auto' size={14} />}
        </button>
      </div>
      <div className='absolute left-full -top-1'>
        {children && isActive && (
          <DropdownItemList items={children} path={path} />
        )}
      </div>
    </li>
  )
}

export function Dropdown({ label, items, Icon }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activePath, setActivePath] = useState<number[]>([])

  const refClick = useClickOutside<HTMLDivElement>(() => {
    setIsOpen(false)
  })

  return (
    <DropdownContext.Provider
      value={{ isOpen, activePath, setIsOpen, setActivePath }}
    >
      <div ref={refClick}>
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className={clsx(
            'text-sm flex items-center gap-1 px-1',
            'border rounded-md relative',
            'border-ui-700',
            'hover:bg-ui-750 bg-ui-800'
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
