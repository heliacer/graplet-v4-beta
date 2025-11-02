import { useEditor } from '../../lib/EditorContext'
import { IDockviewPanelProps } from 'dockview-react'
import { useProjectLoader } from '../../lib/hooks/useProjectLoader'
import { useRenderer } from '../../lib/hooks/useRenderer'

export default function ScenePanel(props: IDockviewPanelProps) {
  const { canvas } = useEditor()

  useProjectLoader()
  useRenderer(props.api)

  return <canvas ref={canvas} className="w-full h-full" />
}
