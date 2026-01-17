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

interface ToolButtonProps {
  tool: TransformControlsMode | ToolItem
  Icon: LucideIcon
}

function ToolButton({ tool, Icon }: ToolButtonProps) {
  const { currentTool, setCurrentTool } = useEditor()

  return (
    <button
      title={tool}
      onClick={() => setCurrentTool(tool)}
      className={clsx(
        'border p-1 rounded-md cursor-pointer',
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
