import { useEditor } from '../../lib/EditorContext'
import { IDockviewPanelProps } from 'dockview-react'
import { useProjectLoader } from '../../lib/hooks/useProjectLoader'
import { useRenderer } from '../../lib/hooks/useRenderer'
import { ObjectControls } from '../ui/controls/objectControls'
import { useTransformControls } from '../../lib/hooks/useTransformControls'
import { useState } from 'react'
import clsx from 'clsx'

export default function ScenePanel(props: IDockviewPanelProps) {
  const { canvas, currentTool } = useEditor()
  const [rightDown, setRightDown] = useState(false)

  useProjectLoader()
  useRenderer(props.api)
  useTransformControls()

  return (
    <div className='relative h-full'>
      <ObjectControls />
      <canvas
        ref={canvas}
        onMouseDown={(e) => {if (e.button === 2) setRightDown(true)}}
        onMouseUp={(e) => {if (e.button === 2) setRightDown(false)}}
        className={clsx(
          rightDown && 'cursor-grabbing',
          currentTool === 'move' && 'cursor-grab active:cursor-grabbing',
          'w-full h-full'
        )}
      />
    </div>
  )
}
