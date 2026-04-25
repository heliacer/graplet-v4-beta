import { useEditorRefs } from '../../context'
import { IDockviewPanelProps } from 'dockview-react'
import { useProjectLoader } from '../../hooks/useProjectLoader'
import { useRenderer } from '../../hooks/useRenderer'
import { useTransformControls } from '../../hooks/useTransformControls'
import { useState } from 'react'
import clsx from 'clsx'
import { useEditorStore } from '../../state'
import { ObjectControls } from '../ui/controls/objectControls'

export default function ScenePanel(props: IDockviewPanelProps) {
  const { canvas } = useEditorRefs()
  const currentTool = useEditorStore(s => s.currentTool)
  const [rightDown, setRightDown] = useState(false)

  useProjectLoader()
  useRenderer(props.api)
  useTransformControls()

  return (
    <div className='relative h-full'>
      <ObjectControls />
      <canvas
        ref={canvas}
        onMouseDown={e => {
          if (e.button === 2) setRightDown(true)
        }}
        onMouseUp={e => {
          if (e.button === 2) setRightDown(false)
        }}
        className={clsx(
          rightDown && 'cursor-grabbing',
          currentTool === 'move' && 'cursor-grab active:cursor-grabbing',
          'w-full h-full'
        )}
      />
    </div>
  )
}
