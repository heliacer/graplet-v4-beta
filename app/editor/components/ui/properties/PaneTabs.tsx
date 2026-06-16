import { StateFunc } from '@/app/editor/types'
import { Cone, Cuboid, LucideIcon, Settings2, Wrench } from 'lucide-react'
import clsx from 'clsx'

export type Pane = 'editor' | 'object' | 'geometry' | 'material'

interface PaneButtonProps {
  className?: string
  Icon: LucideIcon
  pane: Pane
  activePane: Pane
  setActivePane: StateFunc<Pane>
}

/**
 * Sets the current activePane in the PropertiesPanel
 *
 * @todo if the active pane is used somewhere else,
 * move it to editor store, so to avoid prop drilling
 * (should be fine for now)
 */
export function PaneButton({
  className,
  Icon,
  pane,
  activePane,
  setActivePane
}: PaneButtonProps) {
  return (
    <button
      title={pane}
      onClick={() => setActivePane(pane)}
      className={clsx(
        'border-l rounded-l-md cursor-pointer',
        activePane === pane
          ? 'border-teal bg-ui-800'
          : 'border-transparent hover:bg-ui-800 hover:border-ui-700',
        className
      )}
    >
      <div
        className={clsx(
          'border-y border-l-0 p-0.5 pr-1 rounded-l-md',
          activePane === pane
            ? 'border-ui-700'
            : 'border-transparent hover:border-ui-700'
        )}
      >
        <Icon size={14} />
      </div>
    </button>
  )
}

interface PaneTabProps {
  activePane: Pane
  setActivePane: StateFunc<Pane>
}

export function PaneTabs({ activePane, setActivePane }: PaneTabProps) {
  return (
    <nav className='flex flex-col gap-1 pl-0.5'>
      <PaneButton
        className='text-cyan'
        Icon={Wrench}
        pane='object'
        activePane={activePane}
        setActivePane={setActivePane}
      />
      <PaneButton
        className='text-teal'
        Icon={Cone}
        pane='geometry'
        activePane={activePane}
        setActivePane={setActivePane}
      />
      <PaneButton
        className='text-orange'
        Icon={Cuboid}
        pane='material'
        activePane={activePane}
        setActivePane={setActivePane}
      />
      <PaneButton
        Icon={Settings2}
        pane='editor'
        activePane={activePane}
        setActivePane={setActivePane}
      />
    </nav>
  )
}
