import { useEditor } from '@/app/editor/lib/EditorContext'
import { DragNumberInput } from '@/app/ui/components/DragNumberInput'
import { RulerDimensionLine } from 'lucide-react'

/**
 * @todo Modify Snapping
 *
 * previous "bug" found: this is the normal three.js snapping behaviour,
 * it instead of snapping to delta x, it uses the global positioning and rounds it to a number which is the snap value.
 *
 * x: 0.25 -> snapping of 1 -> goes to 1 instead of 1.25
 */
export function ObjectSnap() {
  const { controls, currentTool } = useEditor()

  return (
    <div className='relative text-sm h-5.5 pointer-events-auto'>
      <RulerDimensionLine
        size={14}
        className='absolute left-1.25 top-1 text-xs select-none'
      />
      <DragNumberInput
        className='rounded border select-none outline-none w-14 pl-4 text-center bg-ui-800 hover:bg-ui-750 focus:bg-ui-750'
        title={`${currentTool} snap`}
        min={0}
        max={currentTool === 'rotate' ? 360 : Infinity}
        dragSpeed={0.1}
        decimals={currentTool === 'rotate' ? 0 : 2}
        step={currentTool === 'rotate' ? 15 : 0.25}
        value={
          currentTool === 'rotate'
            ? controls.current?.rotationSnap !== undefined &&
              controls.current.rotationSnap !== null
              ? (controls.current.rotationSnap * 180) / Math.PI
              : 45
            : currentTool === 'scale'
              ? controls.current?.scaleSnap !== undefined &&
                controls.current.scaleSnap !== null
                ? controls.current.scaleSnap
                : 1
              : controls.current?.translationSnap !== undefined &&
                  controls.current.translationSnap !== null
                ? controls.current.translationSnap
                : 0.5
        }
        onChange={newVal => {
          if (currentTool === 'rotate') {
            controls.current?.setRotationSnap((newVal / 180) * Math.PI)
          } else if (currentTool === 'scale') {
            controls.current?.setScaleSnap(newVal)
          } else {
            controls.current?.setTranslationSnap(newVal)
          }
        }}
      />
      {currentTool === 'rotate' && (
        <span className='absolute right-1 top-0.5 text-xs select-none'>°</span>
      )}
    </div>
  )
}
