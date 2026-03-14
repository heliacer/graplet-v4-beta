import {
  Hand,
  LucideIcon,
  MousePointer2,
  Rotate3D,
  Scale3D,
  Spline
} from 'lucide-react'
import { useEditor } from '../../../lib/EditorContext'
import clsx from 'clsx'
import { TransformControlsMode } from 'three/examples/jsm/Addons.js'
import { ToolItem } from '@/app/editor/lib/types'
import { MOUSE } from 'three'

interface ToolButtonProps {
  tool: TransformControlsMode | ToolItem
  Icon: LucideIcon
}

function ToolButton({ tool, Icon }: ToolButtonProps) {
  const { currentTool, setCurrentTool, orbitMap, camera } = useEditor()

  return (
    <button
      title={tool}
      onClick={() => {
        /** @todo Testing, might move this */
        if (camera) {
          const orbit = orbitMap.current.get(camera.id)
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
          ? 'border-teal/70 bg-teal/20'
          : 'bg-ui-800 border-ui-700 hover:bg-ui-750'
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
