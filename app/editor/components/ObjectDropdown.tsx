import {
  DropdownButton,
  DropdownContent,
  DropdownMenu,
  DropdownOption
} from '@/app/ui/components/Dropdown'
import clsx from 'clsx'
import {
  Box,
  Camera,
  ChevronDown,
  Component,
  DiamondPlus,
  Lightbulb
} from 'lucide-react'
import { useObjectActions } from '../lib/hooks/useObjectActions'

export function ObjectDropdown() {
  const { addObject } = useObjectActions()

  return (
    <DropdownMenu className="text-sm">
      <DropdownButton
        className={() =>
          clsx(
            'flex items-center gap-1 px-1',
            'border rounded-md bg-zinc-800 border-zinc-600 cursor-pointer'
          )
        }
      >
        <DiamondPlus size={14} />
        <p>Add</p>
        <ChevronDown size={14} />
      </DropdownButton>
      <DropdownContent align="left" side="top">
        <DropdownOption
          onClick={() => addObject({ type: 'Group', name: 'Group' })}
        >
          <Component size={14} />
          <p>Group</p>
        </DropdownOption>
        <DropdownOption>
          <Box size={14} />
          <p>Mesh</p>
        </DropdownOption>
        <DropdownOption>
          <Lightbulb size={14} />
          <p>Light</p>
        </DropdownOption>
        <DropdownOption>
          <Camera size={14} />
          <p>Camera</p>
        </DropdownOption>
      </DropdownContent>
    </DropdownMenu>
  )
}
