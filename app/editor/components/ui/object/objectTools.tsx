import { LucideIcon, Move3D, Rotate3D, Scale3D } from 'lucide-react'
import { useEditor } from '../../../lib/EditorContext'
import clsx from 'clsx'
import { TransformControlsMode } from 'three/examples/jsm/Addons.js'

interface ToolButtonProps {
  tool: TransformControlsMode
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
          ? 'bg-teal border-teal'
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
      <ToolButton tool='translate' Icon={Move3D} />
      <ToolButton tool='rotate' Icon={Rotate3D} />
      <ToolButton tool='scale' Icon={Scale3D} />
    </div>
  )
}
