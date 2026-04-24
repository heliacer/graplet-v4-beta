import { useCurrentObject } from '@/app/editor/lib/hooks/useCurrentObject'
import { useEditorStore } from '@/app/editor/lib/state'
import { ObjectActions } from '../object/objectActions'
import { ObjectAdd } from '../object/objectAdd'
import { ObjectSnap } from '../object/objectSnap'
import { ObjectTools } from '../object/objectTools'
import { ObjectView } from '../object/objectView'
import { TransformControlsMode } from 'three/examples/jsm/controls/TransformControls.js'

export function ObjectControls() {
  const isRunning = useEditorStore(s => s.isRunning)
  const currentTool = useEditorStore(s => s.currentTool)

  const object = useCurrentObject()

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
        {object && <ObjectActions object={object} />}
        {currentTool in Modes && (
          <ObjectSnap mode={currentTool as TransformControlsMode} />
        )}
      </div>
    </div>
  )
}
