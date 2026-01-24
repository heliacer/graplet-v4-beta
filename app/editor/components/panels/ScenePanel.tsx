import { useEditor } from '../../lib/EditorContext'
import { IDockviewPanelProps } from 'dockview-react'
import { useProjectLoader } from '../../lib/hooks/useProjectLoader'
import { useRenderer } from '../../lib/hooks/useRenderer'
import { ObjectControls } from '../ui/controls/objectControls'
import { useTransformControls } from '../../lib/hooks/useTransformControls'
import clsx from 'clsx'

export default function ScenePanel(props: IDockviewPanelProps) {
  const { canvas, currentTool } = useEditor()

  useProjectLoader()
  useRenderer(props.api)
  useTransformControls()

  return (
    <>
      <ObjectControls />
      <canvas
        ref={canvas}
        className={clsx(
          currentTool === 'move' && 'cursor-grab active:cursor-grabbing',
          'w-full h-full'
        )}
      />
    </>
  )
}
