import { useEditor } from "@/app/editor/lib/EditorContext"
import DragNumberInput from "@/app/ui/components/DragNumberInput"
import { RulerDimensionLine } from "lucide-react"

export function ObjectSnap() {
  const { controls, setObjectVersion } = useEditor()

  /** @todo include all tools + refactor and remove it from editor props panel */
  return (
    <div className='relative text-sm h-5.5'>
      <RulerDimensionLine size={14} className='absolute left-1.5 top-1 text-xs select-none'/>
      <DragNumberInput
        className='rounded border outline-none w-14 pl-4 text-center bg-ui-800 hover:bg-ui-750 focus:bg-ui-750'
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
  )
}