import { useEditorStore } from '@/app/editor/lib/state'
import { DragNumberInput } from '@/app/ui/components/DragNumberInput'
import { RulerDimensionLine } from 'lucide-react'
import { TransformControlsMode } from 'three/examples/jsm/controls/TransformControls.js'

/** @todo (#63) Modify Object Snapping */
export function ObjectSnap({ mode }: { mode: TransformControlsMode }) {
  const setObjectSnapping = useEditorStore(s => s.setObjectSnapping)
  const objectSnapping = useEditorStore(s => s.objectSnapping)

  return (
    <div className='relative text-sm h-5.5 pointer-events-auto'>
      <RulerDimensionLine
        size={14}
        className='absolute left-1.25 top-1 text-xs select-none'
      />
      <DragNumberInput
        className='rounded border select-none outline-none w-14 pl-4 text-center bg-ui-800 hover:bg-ui-750 focus:bg-ui-750'
        title={`${mode} snap`}
        min={0}
        max={mode === 'rotate' ? 360 : Infinity}
        dragSpeed={0.1}
        decimals={mode === 'rotate' ? 0 : 2}
        step={mode === 'rotate' ? 15 : 0.25}
        value={objectSnapping[mode]}
        onChange={newVal => setObjectSnapping(mode, newVal)}
      />
      {mode === 'rotate' && (
        <span className='absolute right-1 top-0.5 text-xs select-none'>°</span>
      )}
    </div>
  )
}
