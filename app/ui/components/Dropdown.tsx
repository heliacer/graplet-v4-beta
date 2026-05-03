import clsx from 'clsx'
import { Check, ChevronDown, ChevronRight, LucideIcon } from 'lucide-react'
import React, {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  useState
} from 'react'
import { useClickOutside } from '../hooks/useClickOutside'
import { StateFunc } from '@/app/editor/types'

/** Helper func to check whether a folder path is in the active path or not */
function isActiveFolder(fp: number[], ap: number[]) {
  return fp.length <= ap.length && fp.every((v, i) => v === ap[i])
}

interface DropdownContextType {
  isOpen: boolean
  activePath: number[]
  setIsOpen: StateFunc<boolean>
  setActivePath: StateFunc<number[]>
}

export const DropdownContext = createContext<DropdownContextType>(null!)

/**
 * Props that go into each dropdown item (including nested)
 */
export interface DropdownItemProps {
  label: string
  Icon?: LucideIcon
  checked?: boolean
  disabled?: boolean
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
  iconStyle?: string
}

interface DropdownItemListProps {
  items: DropdownItemProps[]
  path?: number[]
}

export function DropdownItemList({ items, path = [] }: DropdownItemListProps) {
  const [flip, setFlip] = useState(false)
  const listRef = useRef<HTMLUListElement>(null)

  useLayoutEffect(() => {
    const ul = listRef.current
    if (!ul) throw Error('list ref ul was not found.')
    const rect = ul.getBoundingClientRect()
    if (rect.right > window.innerWidth) setFlip(true)
    else if (rect.left < 0) setFlip(false)
  }, [items])

  return (
    <ul
      ref={listRef}
      className={clsx(
        path.length > 0 && (flip ? 'right-full -top-1' : 'left-full -top-1'),
        'bg-ui-800 border border-ui-700 rounded py-0.5',
        'mt-0.5 text-xs absolute z-999 pointer-events-auto'
      )}
    >
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
  checked,
  disabled,
  onClick,
  children
}: DropdownItemProps & { path: number[] }) {
  const { activePath, setIsOpen, setActivePath } = useContext(DropdownContext)
  const isActive = isActiveFolder(path, activePath)

  return (
    <li className='relative' onMouseEnter={() => setActivePath(path)}>
      <div className='mx-0.5'>
        <button
          disabled={disabled}
          className={clsx(
            'flex gap-1 px-0.5 items-center w-full text-nowrap',
            'rounded border',
            disabled
              ? 'text-ui-400 border-transparent'
              : isActive
                ? 'bg-ui-700 border-ui-600'
                : 'border-transparent hover:border-ui-600 hover:bg-ui-700'
          )}
          onMouseDown={e => {
            onClick?.(e)
            if (!children && checked === undefined) {
              setIsOpen(false)
            }
          }}
        >
          {Icon ? (
            <Icon size={14} />
          ) : checked ? (
            <Check size={14} />
          ) : (
            <div className='w-3.5' />
          )}
          {label}
          {children ? (
            <ChevronRight className='ml-auto' size={14} />
          ) : (
            <div className='w-3.5' />
          )}
        </button>
      </div>
      {children && isActive && (
        <DropdownItemList items={children} path={path} />
      )}
    </li>
  )
}

export function Dropdown({ label, items, Icon, iconStyle: iconStyle }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activePath, setActivePath] = useState<number[]>([])

  const refClick = useClickOutside<HTMLDivElement>(() => {
    setIsOpen(false)
  })

  return (
    <DropdownContext.Provider
      value={{ isOpen, activePath, setIsOpen, setActivePath }}
    >
      <div className='relative' ref={refClick}>
        <button
          onMouseDown={() => setIsOpen(prev => !prev)}
          className={clsx(
            'text-sm flex items-center gap-1 px-1 pointer-events-auto',
            'border rounded-md relative',
            'border-ui-700',
            'hover:bg-ui-750 bg-ui-800'
          )}
        >
          {Icon && <Icon size={14} className={iconStyle} />}
          {label}
          <ChevronDown size={14} />
        </button>
        {items && isOpen && <DropdownItemList items={items} />}
      </div>
    </DropdownContext.Provider>
  )
}
