import { useEffect, useRef } from 'react'
import { useEditor } from '../EditorContext'
import { TransformControls } from 'three/examples/jsm/Addons.js'

export function useTransformControls() {
  const {
    scene,
    canvas,
    currentObject,
    camera,
    orbitMap,
    currentTool,
    setObjectVersion
  } = useEditor()
  const controls = useRef<TransformControls | null>(null)

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
    controls.current.setMode(currentTool)
    controls.current.attach(currentObject)

    controls.current.addEventListener('dragging-changed', (e) => {
      const orbit = orbitMap.current.get(camera.id)
      if (orbit) {
        orbit.enabled = !e.value
      }
    })

    controls.current.addEventListener('change', () =>
      setObjectVersion((prev) => prev + 1)
    )

    return () => {
      controls.current?.detach()
      controls.current?.dispose()
    }
  }, [
    currentObject,
    camera,
    canvas,
    currentTool,
    orbitMap,
    scene,
    setObjectVersion
  ])
}
