import { useEditorStore } from '@/app/editor/state'
import { ObjectActions } from '../object/ObjectActions'
import { ObjectAdd } from '../object/ObjectAdd'
import { ObjectSnap } from '../object/ObjectSnap'
import { ObjectTools } from '../object/ObjectTools'
import { ObjectView } from '../object/ObjectView'
import { TransformControlsMode } from 'three/addons/controls/TransformControls.js'
import { ObjectSelection } from '../object/ObjectSelection'

export function ObjectControls() {
  const isRunning = useEditorStore(s => s.isRunning)
  const currentTool = useEditorStore(s => s.currentTool)

  enum Modes {
    'translate',
    'rotate',
    'scale'
  }

  if (isRunning) return

  return (
    <div className='absolute flex gap-2 m-1.5 pointer-events-none'>
      <ObjectTools />
      <div className='flex gap-2 h-min'>
        <ObjectAdd />
        <ObjectView />
        <ObjectActions />
        <ObjectSelection/>
        {currentTool in Modes && (
          <ObjectSnap mode={currentTool as TransformControlsMode} />
        )}
      </div>
    </div>
  )
}
