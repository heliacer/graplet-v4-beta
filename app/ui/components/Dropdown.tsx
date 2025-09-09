'use client'

import { useState, createContext, useContext, ReactNode } from 'react'
import { useClickOutside } from '../hooks/useClickOutside'
import clsx from 'clsx'

interface DropdownContextType {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  close: () => void
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

  const dropdownRef = useClickOutside<HTMLDivElement>(() => {
    setIsOpen(false)
  })

  const close = () => setIsOpen(false)

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen, close }}>
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
        'absolute top-full rounded-lg translate-y-0.5 border border-zinc-700 bg-zinc-800 z-[999]',
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
    'border border-transparent rounded m-1 px-1 hover:border-zinc-600 hover:bg-zinc-700'

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
