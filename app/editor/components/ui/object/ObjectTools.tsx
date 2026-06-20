import { useEditorRefs } from '../../../context/EditorContext'
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
import { TransformControlsMode } from 'three/addons/controls/TransformControls.js'
import clsx from 'clsx'

interface ToolButtonProps {
  tool: TransformControlsMode | ToolItem
  Icon: LucideIcon
}

function ToolButton({ tool, Icon }: ToolButtonProps) {
  const { orbitMapRef, cameraRef } = useEditorRefs()
  const currentTool = useEditorStore(s => s.currentTool)
  const setCurrentTool = useEditorStore(s => s.setCurrentTool)

  return (
    <button
      title={tool}
      onClick={() => {
        if (cameraRef.current) {
          const orbit = orbitMapRef.current.get(cameraRef.current.id)
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
