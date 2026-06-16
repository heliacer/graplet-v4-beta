import { useState } from 'react'
import { EditorPane } from '../ui/properties/panes/EditorPane'
import { GeometryPane } from '../ui/properties/panes/GeometryPane'
import { MaterialPane } from '../ui/properties/panes/MaterialPane'
import { ObjectPane } from '../ui/properties/panes/ObjectPane'
import { Pane, PaneTabs } from '../ui/properties/PaneTabs'

export default function PropertiesPanel() {
  const [activePane, setActivePane] = useState<Pane>('object')
  /** @todo (#57) Propertypanel: serialize inputs & panes and allow multiselect */

  return (
    <div className='flex h-full'>
      <PaneTabs activePane={activePane} setActivePane={setActivePane} />
      <div className='p-1.5 flex flex-col gap-2 text-xs w-full rounded outline-1 z-10 outline-ui-700 select-none'>
        {activePane === 'object' && <ObjectPane />}
        {activePane === 'geometry' && <GeometryPane />}
        {activePane === 'material' && <MaterialPane />}
        {activePane === 'editor' && <EditorPane />}
      </div>
    </div>
  )
}
