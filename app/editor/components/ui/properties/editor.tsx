import { useEditor } from '@/app/editor/lib/EditorContext'
import { CheckBoxProperty } from '../PropertyInput'
import DragNumberInput from '@/app/ui/components/DragNumberInput'

export default function EditorProps() {
  const { controls, setObjectVersion } = useEditor()

  return (
    <>
      <CheckBoxProperty
        label='Local Transforms'
        checked={controls.current?.space === 'local'}
        action={(checked) => {
          if (checked) {
            controls.current?.setSpace('local')
          } else {
            controls.current?.setSpace('world')
          }
        }}
      />
      <div className='flex gap-2'>
        <p>Translation Snap</p>
        <DragNumberInput
          className='rounded border outline-none w-10 text-center hover:bg-ui-750 focus:bg-ui-750'
          min={0}
          dragSpeed={0.1}
          step={0.5}
          value={controls.current?.translationSnap || 0}
          onChange={(newVal) => {
            controls.current?.setTranslationSnap(newVal)
            setObjectVersion((prev) => prev + 1)
          }}
        />
      </div>
      <div className='flex gap-2'>
        <p>Rotation Snap</p>
        <div className='relative'>
          <DragNumberInput
            className='rounded border outline-none w-10 pr-1 text-center hover:bg-ui-750 focus:bg-ui-750'
            min={0}
            max={360}
            decimals={0}
            dragSpeed={5}
            value={Number(
              ((controls.current?.rotationSnap || 0) * 180) / Math.PI
            )}
            onChange={(newVal) => {
              controls.current?.setRotationSnap((newVal * Math.PI) / 180)
              setObjectVersion((prev) => prev + 1)
            }}
          />
          <span className='absolute right-1.5 top-0.5 text-xs select-none'>
            °
          </span>
        </div>
      </div>
      <div className='flex gap-2'>
        <p>Scale Snap</p>
        <DragNumberInput
          className='rounded border outline-none w-10 text-center hover:bg-ui-750 focus:bg-ui-750'
          min={0}
          dragSpeed={0.1}
          step={0.5}
          value={controls.current?.scaleSnap || 0}
          onChange={(newVal) => {
            controls.current?.setScaleSnap(newVal)
            setObjectVersion((prev) => prev + 1)
          }}
        />
      </div>
    </>
  )
}
