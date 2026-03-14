import { useState } from 'react'
import { Cone, Cuboid, LucideIcon, Settings2, Wrench } from 'lucide-react'
import clsx from 'clsx'
import { EditorPane } from '../ui/properties/editor'
import { GeometryPane } from '../ui/properties/geometry'
import { MaterialPane } from '../ui/properties/material'
import { ObjectPane } from '../ui/properties/object'
import { StateFunc } from '../../lib/types'
import { useCurrentObject } from '../../lib/hooks/useCurrentObject'

type Pane = 'editor' | 'object' | 'geometry' | 'material'

interface PaneButtonProps {
  className?: string
  Icon: LucideIcon
  pane: Pane
  activePane: Pane
  setActivePane: StateFunc<Pane>
}

/**
 * Sets the current activePane in the PropertiesPanel
 */
function PaneButton({
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

export default function PropertiesPanel() {
  const [activePane, setActivePane] = useState<Pane>('object')

  const object = useCurrentObject()
  if (!object) return

  return (
    <div className='flex h-full'>
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
      <div className='p-1.5 flex flex-col gap-2 text-xs w-full rounded outline-1 z-10 outline-ui-700'>
        {activePane === 'object' && <ObjectPane object={object} />}
        {activePane === 'geometry' && <GeometryPane object={object} />}
        {activePane === 'material' && <MaterialPane object={object} />}
        {activePane === 'editor' && <EditorPane />}
      </div>
    </div>
  )
}
