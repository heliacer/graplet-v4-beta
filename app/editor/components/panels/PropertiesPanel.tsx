import { useEditor } from '../../lib/EditorContext'
import { useState } from 'react'
import ObjectProps from '../ui/properties/objectProperties'
import { Wrench } from 'lucide-react'
import clsx from 'clsx'

type PropertiesTab = 'object' | 'geometry' | 'material'

/** @todo update: this is actually starting to get peak, need to have dynamic props for each object tho */
export default function PropertiesPanel() {
  const [activeTab, setActiveTab] = useState<PropertiesTab>('object')

  const { currentObject } = useEditor()

  if (!currentObject) return

  return (
    <div className='flex h-full'>
      <nav className='border-r'>
        <button
          onClick={() => setActiveTab('geometry')}
          className={clsx(
            'border p-1 rounded-md cursor-pointer',
            activeTab === 'object'
              ? 'bg-teal-600 border-teal-600'
              : 'bg-zinc-800 border-zinc-700 hover:bg-zinc-750'
          )}
        >
          <Wrench size={14} />
        </button>
      </nav>
      <div className="p-1.5 flex flex-col gap-2 text-xs">
        {activeTab === 'object' && <ObjectProps object={currentObject} />}
      </div>
    </div>

  )
}
