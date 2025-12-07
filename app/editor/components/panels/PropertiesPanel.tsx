import { useEditor } from '../../lib/EditorContext'
import { useState } from 'react'
import ObjectProps from '../ui/properties/object'
import { Cone, Cuboid, LucideIcon, Settings2, Wrench } from 'lucide-react'
import clsx from 'clsx'
import GeometryProps from '../ui/properties/geometry'
import MaterialProps from '../ui/properties/material'
import EditorProps from '../ui/properties/editor'

type PropertiesTab = 'editor' | 'object' | 'geometry' | 'material'

interface PropertyTabButtonProps {
  Icon: LucideIcon
  className?: string
  active: boolean
  setActive: () => void
}

function PropertyTabButton({
  Icon,
  className,
  active,
  setActive
}: PropertyTabButtonProps) {
  return (
    <button
      onClick={setActive}
      className={clsx(
        'border-l rounded-md cursor-pointer',
        active
          ? 'border-teal-600 bg-zinc-800'
          : 'border-transparent hover:bg-zinc-800 hover:border-zinc-700',
        className
      )}
    >
      <div
        className={clsx(
          'border border-l-0 p-0.5 rounded-md',
          active
            ? 'border-zinc-700'
            : 'border-transparent hover:border-zinc-700'
        )}
      >
        <Icon size={14} />
      </div>
    </button>
  )
}

export default function PropertiesPanel() {
  const [activeTab, setActiveTab] = useState<PropertiesTab>('object')
  const { currentObject } = useEditor()
  if (!currentObject) return

  return (
    <div className="flex h-full">
      <nav className="flex flex-col gap-1 p-0.5">
        <PropertyTabButton
          Icon={Settings2}
          active={activeTab === 'editor'}
          setActive={() => setActiveTab('editor')}
        />
        <PropertyTabButton
          Icon={Wrench}
          className="text-blue-300"
          active={activeTab === 'object'}
          setActive={() => setActiveTab('object')}
        />
        <PropertyTabButton
          Icon={Cone}
          className="text-teal-300"
          active={activeTab === 'geometry'}
          setActive={() => setActiveTab('geometry')}
        />
        <PropertyTabButton
          Icon={Cuboid}
          className="text-orange-300"
          active={activeTab === 'material'}
          setActive={() => setActiveTab('material')}
        />
      </nav>
      <div className="p-1.5 flex flex-col gap-2 text-xs w-full">
        {activeTab === 'editor' && <EditorProps />}
        {activeTab === 'object' && <ObjectProps object={currentObject} />}
        {activeTab === 'geometry' && <GeometryProps object={currentObject} />}
        {activeTab === 'material' && <MaterialProps object={currentObject} />}
      </div>
    </div>
  )
}
