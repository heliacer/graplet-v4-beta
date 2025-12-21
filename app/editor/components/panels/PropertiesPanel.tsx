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
  className?: string
  Icon: LucideIcon
  tab: PropertiesTab
  activeTab: PropertiesTab
  setActiveTab: React.Dispatch<React.SetStateAction<PropertiesTab>>
}

function PropertyTabButton({
  className,
  Icon,
  tab,
  activeTab,
  setActiveTab: setActive
}: PropertyTabButtonProps) {
  return (
    <button
      title={tab}
      onClick={() => setActive(tab)}
      className={clsx(
        'border-l rounded-md cursor-pointer',
        activeTab === tab
          ? 'border-teal bg-ui-800'
          : 'border-transparent hover:bg-ui-800 hover:border-ui-700',
        className
      )}
    >
      <div
        className={clsx(
          'border border-l-0 p-0.5 rounded-md',
          activeTab === tab
            ? 'border-ui-700'
            : 'border-transparent hover:border-ui-700'
        )}
      >
        <Icon size={14} />
      </div>
    </button>
  )
}

/** @todo might consider making context for activeTab, setActiveTab */
export default function PropertiesPanel() {
  const [activeTab, setActiveTab] = useState<PropertiesTab>('object')
  const { currentObject } = useEditor()
  if (!currentObject) return

  return (
    <div className='flex h-full'>
      <nav className='flex flex-col gap-1 p-0.5'>
        <PropertyTabButton
          className='text-cyan'
          Icon={Wrench}
          tab='object'
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <PropertyTabButton
          className='text-teal'
          Icon={Cone}
          tab='geometry'
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <PropertyTabButton
          className='text-orange'
          Icon={Cuboid}
          tab='material'
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <PropertyTabButton
          Icon={Settings2}
          tab='editor'
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </nav>
      <div className='p-1.5 flex flex-col gap-2 text-xs w-full'>
        {activeTab === 'object' && <ObjectProps object={currentObject} />}
        {activeTab === 'geometry' && <GeometryProps object={currentObject} />}
        {activeTab === 'material' && <MaterialProps object={currentObject} />}
        {activeTab === 'editor' && <EditorProps />}
      </div>
    </div>
  )
}
