import { useEditorRefs } from '../../context/editor'
import { IDockviewPanelProps } from 'dockview-react'
import { useProjectLoader } from '../../hooks/useProjectLoader'
import { useRenderer } from '../../hooks/useRenderer'
import { useTransformControls } from '../../hooks/useTransformControls'
import { useState } from 'react'
import clsx from 'clsx'
import { useEditorStore } from '../../state'
import { ObjectControls } from '../ui/controls/objectControls'
import { useKeybind } from '../../context/keybinds'
import { Vector3 } from 'three'

export default function ScenePanel(props: IDockviewPanelProps) {
  const { workspace, canvas, orbitMap } = useEditorRefs()
  const currentTool = useEditorStore(s => s.currentTool)
  const autoClose = useEditorStore(s => s.autoClose)
  const setAutoClose = useEditorStore(s => s.setAutoClose)
  const camera = useEditorStore(s => s.camera)
  const [rightDown, setRightDown] = useState(false)

  useProjectLoader()
  useRenderer(props.api)
  useTransformControls()

  const snapCamera = (direction: Vector3) => {
    if (!camera) return
    const orbit = orbitMap.current.get(camera.id)
    if (!orbit) return

    const distance = camera.position.distanceTo(orbit.target)
    camera.position.copy(orbit.target).addScaledVector(direction, distance)
    orbit.update()
  }

  useKeybind({ code: 'Numpad0', modifiers: [] }, () => {
    if (!camera) return
    const orbit = orbitMap.current.get(camera.id)
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

  useKeybind(
    {
      key: 'y',
      modifiers: ['Ctrl']
    },
    () => {
      setAutoClose(!autoClose)
      const flyout = workspace.current?.getFlyout()
      console.log(flyout)
      if (flyout) {
        flyout.autoClose = !autoClose
      }
    }
  )

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
