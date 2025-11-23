import { useEditor } from '../../lib/EditorContext'
import { useState } from 'react'
import ObjectProps from '../ui/properties/object'
import { Cone, Cuboid, Wrench } from 'lucide-react'
import clsx from 'clsx'
import GeometryProps from '../ui/properties/geometry'
import MaterialProps from '../ui/properties/material'

type PropertiesTab = 'object' | 'geometry' | 'material'

/** @todo update: this is actually starting to get peak, need to have dynamic props for each object tho */
export default function PropertiesPanel() {
  const [activeTab, setActiveTab] = useState<PropertiesTab>('object')

  const { currentObject } = useEditor()

  if (!currentObject) return

  return (
    <div className="flex h-full">
      <nav className="flex flex-col gap-1 border-r border-zinc-700 p-0.5">
        {/* getting nasty, needs refactor */}
        <button
          onClick={() => setActiveTab('object')}
          className={clsx(
            'border p-0.5 rounded-md cursor-pointer',
            activeTab === 'object'
              ? 'bg-zinc-750 border-zinc-700'
              : 'bg-zinc-800 border-zinc-700 hover:bg-zinc-750'
          )}
        >
          <Wrench size={14} />
        </button>
        <button
          onClick={() => setActiveTab('geometry')}
          className={clsx(
            'border p-0.5 rounded-md cursor-pointer',
            activeTab === 'geometry'
              ? 'bg-zinc-750 border-zinc-700'
              : 'bg-zinc-800 border-zinc-700 hover:bg-zinc-750'
          )}
        >
          <Cone className="text-blue-300" size={14} />
        </button>
        <button
          onClick={() => setActiveTab('material')}
          className={clsx(
            'border p-0.5 rounded-md cursor-pointer',
            activeTab === 'material'
              ? 'bg-zinc-750 border-zinc-700'
              : 'bg-zinc-800 border-zinc-700 hover:bg-zinc-750'
          )}
        >
          <Cuboid className="text-teal-300" size={14} />
        </button>
      </nav>
      <div className="p-1.5 flex flex-col gap-2 text-xs">
        {activeTab === 'object' && <ObjectProps object={currentObject} />}
        {activeTab === 'geometry' && <GeometryProps object={currentObject} />}
        {activeTab === 'material' && <MaterialProps object={currentObject} />}
      </div>
    </div>
  )
}
