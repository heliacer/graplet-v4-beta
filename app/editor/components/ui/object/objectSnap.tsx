import { useEditor } from '@/app/editor/lib/EditorContext'
import DragNumberInput from '@/app/ui/components/DragNumberInput'
import { RulerDimensionLine } from 'lucide-react'

export function ObjectSnap() {
  const {
    currentTool,
    translationSnap,
    rotationSnap,
    scaleSnap,
    setTranslationSnap,
    setRotationSnap,
    setScaleSnap
  } = useEditor()

  /**
   * @todo remove it from editor props panel
   * + redo states, make transformcontrols better so that we can access directly, no separate state needed
   */
  return (
    <div className='relative text-sm h-5.5'>
      <RulerDimensionLine
        size={14}
        className='absolute left-1.5 top-1 text-xs select-none'
      />
      <DragNumberInput
        className='rounded border outline-none w-14 pl-4 select-none text-center bg-ui-800 hover:bg-ui-750 focus:bg-ui-750'
        min={0}
        max={currentTool === 'rotate' ? 360 : Infinity}
        dragSpeed={currentTool === 'rotate' ? 5 : 0.1}
        decimals={currentTool === 'rotate' ? 0 : 2}
        step={currentTool === 'rotate' ? 0.1 : 0.5}
        value={
          currentTool === 'rotate'
            ? rotationSnap
            : currentTool === 'scale'
              ? scaleSnap
              : translationSnap
        }
        onChange={(newVal) => {
          if (currentTool === 'rotate') {
            setRotationSnap(newVal)
          } else if (currentTool === 'scale') {
            setScaleSnap(newVal)
          } else {
            setTranslationSnap(newVal)
          }
        }}
      />
      {currentTool === 'rotate' && (
        <span className='absolute right-1 top-0.5 text-xs select-none'>°</span>
      )}
    </div>
  )
}
