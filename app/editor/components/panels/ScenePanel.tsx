import { useEditorRefs } from '../../context/EditorContext'
import { IDockviewPanelProps } from 'dockview-react'
import { useProjectLoader } from '../../hooks/useProjectLoader'
import { useRenderer } from '../../hooks/useRenderer'
import { useTransformControls } from '../../hooks/useTransformControls'
import { useState } from 'react'
import clsx from 'clsx'
import { useEditorStore } from '../../state'
import { ObjectControls } from '../ui/controls/ObjectControls'
import { useKeybind } from '../../context/KeybindsContext'
import { Vector3 } from 'three'
import { useOutline } from '../../hooks/useOutline'

export default function ScenePanel(props: IDockviewPanelProps) {
  const { workspaceRef, cameraRef, canvasRef, orbitMapRef } = useEditorRefs()
  const currentTool = useEditorStore(s => s.currentTool)
  const autoClose = useEditorStore(s => s.autoClose)
  const setAutoClose = useEditorStore(s => s.setAutoClose)
  const setCurrentTool = useEditorStore(s => s.setCurrentTool)
  const [rightDown, setRightDown] = useState(false)

  useProjectLoader()
  useRenderer(props.api)
  useOutline()
  useTransformControls()

  const snapCamera = (direction: Vector3) => {
    if (!cameraRef.current) return
    const orbit = orbitMapRef.current.get(cameraRef.current.id)
    if (!orbit) return

    const distance = cameraRef.current.position.distanceTo(orbit.target)
    cameraRef.current.position
      .copy(orbit.target)
      .addScaledVector(direction, distance)
    orbit.update()
  }

  useKeybind({ code: 'Numpad0', modifiers: [] }, () => {
    if (!cameraRef.current) return
    const orbit = orbitMapRef.current.get(cameraRef.current.id)
    orbit?.target.set(0, 0, 0)
  })

  useKeybind({ code: 'Numpad1', modifiers: [] }, () =>
    snapCamera(new Vector3(0, 0, 1))
  )
  useKeybind({ code: 'Numpad2', modifiers: [] }, () =>
    snapCamera(new Vector3(0, 1, 0))
  )
  useKeybind({ code: 'Numpad3', modifiers: [] }, () =>
    snapCamera(new Vector3(1, 0, 0))
  )
  useKeybind({ key: 't', modifiers: [] }, () => setCurrentTool('translate'))
  useKeybind({ key: 'r', modifiers: [] }, () => setCurrentTool('rotate'))
  useKeybind({ key: 's', modifiers: [] }, () => setCurrentTool('scale'))
  useKeybind({ key: 'm', modifiers: [] }, () => setCurrentTool('move'))
  useKeybind({ key: 'p', modifiers: [] }, () => setCurrentTool('path'))

  useKeybind(
    {
      key: 'y',
      modifiers: ['Ctrl']
    },
    () => {
      setAutoClose(!autoClose)
      const flyout = workspaceRef.current?.getFlyout()
      if (flyout) {
        flyout.autoClose = !autoClose
      }
    }
  )

  return (
    <div className='relative h-full'>
      <ObjectControls />
      <canvas
        ref={canvasRef}
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
