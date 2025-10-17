'use client'

import {
  useState,
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useMemo,
  useId,
  MouseEvent
} from 'react'
import { ChevronRight } from 'lucide-react'
import { useClickOutside } from '../hooks/useClickOutside'
import clsx from 'clsx'

interface DropdownContextType {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  close: () => void
  activeFolderId: string | null
  openFolder: (id: string) => void
  closeFolder: (id: string) => void
  toggleFolder: (id: string) => void
}

const DropdownContext = createContext<DropdownContextType | undefined>(
  undefined
)

const useDropdown = () => {
  const context = useContext(DropdownContext)
  if (!context) {
    throw new Error('Dropdown components must be used within a DropdownMenu')
  }
  return context
}

interface DropdownMenuProps {
  children: ReactNode
  className?: string
}

export function DropdownMenu({ children, className }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null)

  const dropdownRef = useClickOutside<HTMLDivElement>(() => {
    setIsOpen(false)
    setActiveFolderId(null)
  })

  const close = () => {
    setIsOpen(false)
    setActiveFolderId(null)
  }

  useEffect(() => {
    if (!isOpen) {
      setActiveFolderId(null)
    }
  }, [isOpen])

  const contextValue = useMemo(
    () => ({
      isOpen,
      setIsOpen,
      close,
      activeFolderId,
      openFolder: (id: string) => setActiveFolderId(id),
      closeFolder: (id: string) =>
        setActiveFolderId((current) => (current === id ? null : current)),
      toggleFolder: (id: string) =>
        setActiveFolderId((current) => (current === id ? null : id))
    }),
    [isOpen, activeFolderId]
  )

  return (
    <DropdownContext.Provider value={contextValue}>
      <div ref={dropdownRef} className={clsx('relative', className)}>
        {children}
      </div>
    </DropdownContext.Provider>
  )
}

interface DropdownButtonProps {
  children: ReactNode
  className?: string
}

export function DropdownButton({ children, className }: DropdownButtonProps) {
  const { isOpen, setIsOpen } = useDropdown()

  return (
    <button
      className={clsx(
        'flex items-center gap-1 border border-transparent rounded-lg cursor-pointer px-1',
        'hover:bg-zinc-800 hover:border-zinc-700',
        isOpen && 'bg-zinc-800 border-zinc-700',
        className
      )}
      onClick={() => setIsOpen(!isOpen)}
    >
      {children}
    </button>
  )
}

interface DropdownContentProps {
  children: ReactNode
  className?: string
  align?: 'left' | 'right' | 'center'
}

export function DropdownContent({
  children,
  className,
  align = 'right'
}: DropdownContentProps) {
  const { isOpen } = useDropdown()

  const alignmentStyles = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 -translate-x-1/2'
  }

  return (
    <div
      className={clsx(
        'absolute top-full rounded-lg translate-y-0.5 pt-1 pb-1 border border-zinc-700 bg-zinc-800 z-[999]',
        alignmentStyles[align],
        !isOpen && 'hidden',
        className
      )}
    >
      {children}
    </div>
  )
}

interface DropdownOptionProps {
  children: ReactNode
  onClick?: () => void
  className?: string
  asChild?: boolean
}

export function DropdownOption({
  children,
  onClick,
  className,
  asChild = false
}: DropdownOptionProps) {
  const { close } = useDropdown()

  const handleClick = () => {
    onClick?.()
    close()
  }

  const baseStyles =
    'border border-transparent rounded mx-1 px-1 hover:border-zinc-600 hover:bg-zinc-700'

  if (asChild) {
    return (
      <div className={clsx(baseStyles, className)} onClick={handleClick}>
        {children}
      </div>
    )
  }

  return (
    <div className={clsx(baseStyles, className)}>
      <button
        className="w-full text-left cursor-pointer flex items-center gap-2"
        onClick={handleClick}
      >
        {children}
      </button>
    </div>
  )
}

export function DropdownSeparator({ className }: { className?: string }) {
  return <hr className={clsx('my-0.5 border-zinc-600', className)} />
}

interface DropdownFolderProps {
  id?: string
  label: ReactNode
  icon?: ReactNode
  children: ReactNode
  className?: string
  contentClassName?: string
  align?: 'right' | 'left'
}

export function DropdownFolder({
  id,
  label,
  icon,
  children,
  className,
  contentClassName,
  align = 'right'
}: DropdownFolderProps) {
  const { activeFolderId, openFolder, closeFolder, toggleFolder } =
    useDropdown()
  const generatedId = useId()
  const folderId = id ?? generatedId
  const isOpen = activeFolderId === folderId

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    toggleFolder(folderId)
  }

  const handleMouseEnter = () => openFolder(folderId)
  const handleMouseLeave = () => closeFolder(folderId)

  const contentAlignment = align === 'right' ? 'left-full' : 'right-full'

  return (
    <div
      className={clsx('relative', className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button type="button" className='w-full' onClick={handleClick}>
        <div
          className={clsx(
            'flex cursor-pointer items-center gap-2 rounded px-1 mx-1 text-left',
            'border border-transparent',
            isOpen && 'border-zinc-600 bg-zinc-700'
          )}
        >
          {icon}
          <span className="flex-1">{label}</span>
          <ChevronRight size={14} className="text-zinc-200" />
        </div>
      </button>
      <div
        className={clsx(
          'absolute top-0 min-w-[160px] rounded-lg border pt-1 pb-1 border-zinc-700 bg-zinc-800',
          'shadow-lg',
          contentAlignment,
          !isOpen && 'hidden',
          contentClassName
        )}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}
