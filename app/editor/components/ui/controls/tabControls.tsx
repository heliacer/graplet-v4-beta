import { useHeaderControls } from '@/app/editor/hooks/useHeaderControls'
import { IDockviewHeaderActionsProps } from 'dockview-react'
import {
  Maximize,
  Minimize,
  Plus,
  SquareArrowOutDownLeft,
  SquareArrowOutUpRight,
  X
} from 'lucide-react'

export function RightControls(props: IDockviewHeaderActionsProps) {
  const { isMaximised, isFloating, toggleMaximized, toggleFloating } =
    useHeaderControls(props)

  const hasUnClosable = props.group.panels.some(
    panel => panel.params?.closable !== true
  )

  return (
    <nav className='flex items-center gap-1 px-1 h-full'>
      <button
        id='toggleFloating'
        className='p-0.5 border border-transparent hover:border-ui-700 hover:bg-ui-800 rounded cursor-pointer'
        onClick={toggleFloating}
      >
        {isFloating ? (
          <SquareArrowOutDownLeft size={16} />
        ) : (
          <SquareArrowOutUpRight size={16} />
        )}
      </button>
      {isFloating && !hasUnClosable && (
        <button
          onClick={() => props.api.close()}
          id='closeFloating'
          className='border border-transparent hover:border-ui-700 hover:bg-ui-800 rounded cursor-pointer'
        >
          <X size={18} />
        </button>
      )}
      {!isFloating && (
        <button
          id='toggleMaximised'
          className='p-0.5 border border-transparent hover:border-ui-700 hover:bg-ui-800 rounded cursor-pointer'
          onClick={toggleMaximized}
        >
          {isMaximised ? <Minimize size={16} /> : <Maximize size={16} />}
        </button>
      )}
    </nav>
  )
}

export function LeftControls(props: IDockviewHeaderActionsProps) {
  function addNew() {
    props.containerApi.addPanel({
      id: crypto.randomUUID(),
      component: 'debug',
      title: `New`,
      position: {
        referenceGroup: props.group
      },
      params: {
        closable: true
      }
    })
  }

  return (
    <nav className='flex items-center gap-1 px-1 h-full'>
      <button
        id='addNew'
        className='p-0.5 border border-transparent hover:border-ui-700 hover:bg-ui-800 rounded cursor-pointer'
        onClick={addNew}
      >
        <Plus size={16} />
      </button>
    </nav>
  )
}
