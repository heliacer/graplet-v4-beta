import { useEditor } from '../../lib/EditorContext'
import { IDockviewPanelProps } from 'dockview-react'
import { useProjectLoader } from '../../lib/hooks/useProjectLoader'
import { useRenderer } from '../../lib/hooks/useRenderer'
import { ObjectControls } from '../ui/controls/objectControls'
import { useEffect, useRef } from 'react'
import { TransformControls } from 'three/examples/jsm/Addons.js'

export default function ScenePanel(props: IDockviewPanelProps) {
  const { scene, canvas, currentObject, camera, orbitMap } = useEditor()
  const controls = useRef<TransformControls | null>(null)

  useProjectLoader()
  useRenderer(props.api)

  /** @todo this is absolute peak, but also absolute shit so need to make it better */
  useEffect(() => {
    /**
     * @todo
     * - if object deleted, dispose of controls
     * - add helpers finally for camera & light
     * - hide transformcontrols in explorerpanel
     */

    if (!camera) return
    if (!currentObject) return

    if (controls.current) {
      scene.current.remove(controls.current.getHelper())
      controls.current.dispose()
    }

    controls.current = new TransformControls(camera, canvas.current)
    const helper = controls.current.getHelper()
    helper.name = 'TransformHelperTemp'
    scene.current.add(helper)

    controls.current.attach(currentObject)

    controls.current.addEventListener('dragging-changed', (e) => {
      const orbit = orbitMap.current.get(camera.id)
      if (orbit) {
        orbit.enabled = !e.value
      }
    })

    return () => {
      controls.current?.detach()
      controls.current?.dispose()
    }
  }, [currentObject, camera, canvas])

  return (
    <>
      <ObjectControls />
      <canvas ref={canvas} className="w-full h-full" />
    </>
  )
}
