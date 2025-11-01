import { useEditor } from '@/app/editor/lib/EditorContext'
import { DropdownButton, DropdownMenu } from '@/app/ui/components/Dropdown'
import clsx from 'clsx'
import { ChevronDown, Hammer, ScanEye } from 'lucide-react'
import { ObjectDropdown } from '../../ObjectDropdown'

export default function Ribbon() {
  const { currentObject } = useEditor()

  if (!currentObject) return

  return (
    <div role="menu" className="flex gap-1 items-center p-1">
      <ObjectDropdown
        target={currentObject}
        buttonStyle={(isOpen, disabled) =>
          clsx(
            'flex items-center gap-1 border border-transparent rounded-md text-sm px-1',
            disabled
              ? 'text-zinc-400'
              : 'cursor-pointer hover:bg-zinc-800 hover:border-zinc-700',
            isOpen && 'bg-zinc-800 border-zinc-700'
          )
        }
        disabled={currentObject.type !== 'Group'}
        folderSide="top"
      />
      <DropdownMenu>
        <DropdownButton
          disabled={currentObject.type !== 'Group'}
          className={(isOpen, disabled) =>
            clsx(
              'flex items-center gap-1 border border-transparent rounded-md text-sm px-1',
              disabled
                ? 'text-zinc-400'
                : 'cursor-pointer hover:bg-zinc-800 hover:border-zinc-700',
              isOpen && 'bg-zinc-800 border-zinc-700'
            )
          }
        >
          <ScanEye size={14} />
          <p>View</p>
          <ChevronDown size={14} />
        </DropdownButton>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownButton
          disabled={currentObject.type !== 'Group'}
          className={(isOpen, disabled) =>
            clsx(
              'flex items-center gap-1 border border-transparent rounded-md text-sm px-1',
              disabled
                ? 'text-zinc-400'
                : 'cursor-pointer hover:bg-zinc-800 hover:border-zinc-700',
              isOpen && 'bg-zinc-800 border-zinc-700'
            )
          }
        >
          <Hammer size={14} />
          <p>Actions</p>
          <ChevronDown size={14} />
        </DropdownButton>
      </DropdownMenu>
    </div>
  )
}
