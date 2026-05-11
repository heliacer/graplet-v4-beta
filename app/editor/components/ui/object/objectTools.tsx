import { useEditorRefs } from '../../../context/editor'
import { useEditorStore } from '@/app/editor/state'
import {
  Hand,
  LucideIcon,
  MousePointer2,
  Rotate3D,
  Scale3D,
  Spline
} from 'lucide-react'
import { MOUSE } from 'three'
import { ToolItem } from '@/app/editor/types'
import { TransformControlsMode } from 'three/examples/jsm/controls/TransformControls.js'
import clsx from 'clsx'

interface ToolButtonProps {
  tool: TransformControlsMode | ToolItem
  Icon: LucideIcon
}

function ToolButton({ tool, Icon }: ToolButtonProps) {
  const { orbitMapRef } = useEditorRefs()
  const currentTool = useEditorStore(s => s.currentTool)
  const setCurrentTool = useEditorStore(s => s.setCurrentTool)
  const camera = useEditorStore(s => s.camera)

  return (
    <button
      title={tool}
      onClick={() => {
        if (camera) {
          const orbit = orbitMapRef.current.get(camera.id)
          if (orbit) {
            if (currentTool === 'move') {
              orbit.mouseButtons.LEFT = null
            }
            if (tool === 'move') {
              orbit.mouseButtons.LEFT = MOUSE.PAN
            }
          }
        }
        setCurrentTool(tool)
      }}
      className={clsx(
        'border p-0.5 rounded-md cursor-pointer pointer-events-auto',
        currentTool === tool
          ? 'border-teal/50 bg-teal/20'
          : 'border-ui-700 bg-ui-800 hover:bg-ui-750'
      )}
    >
      <Icon size={16} />
    </button>
  )
}

export function ObjectTools() {
  return (
    <div className='flex flex-col gap-2'>
      <ToolButton tool='translate' Icon={MousePointer2} />
      <ToolButton tool='move' Icon={Hand} />
      <ToolButton tool='rotate' Icon={Rotate3D} />
      <ToolButton tool='scale' Icon={Scale3D} />
      <ToolButton tool='path' Icon={Spline} />
    </div>
  )
}
