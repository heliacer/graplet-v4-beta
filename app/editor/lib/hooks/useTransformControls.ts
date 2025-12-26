import { useEffect } from 'react'
import { useEditor } from '../EditorContext'
import { TransformControls } from 'three/examples/jsm/Addons.js'
import { isInternalObject } from '../utils/sobject3d'

export function useTransformControls() {
  const {
    scene,
    canvas,
    currentObject,
    camera,
    orbitMap,
    currentTool,
    controls,
    setObjectVersion
  } = useEditor()

  useEffect(() => {
    /**
     * @todo reuse transformcontrols and not dispose it, just change the object (the ui should update)
     * so that modifications to the Space, translation/rotation/scale snap stay
     */

    if (!camera) return
    if (!currentObject) return
    if (isInternalObject(currentObject)) return

    if (controls.current) {
      scene.current.remove(controls.current.getHelper())
      controls.current.dispose()
    }

    controls.current = new TransformControls(camera, canvas.current)

    controls.current.setTranslationSnap(0.5)
    controls.current.setRotationSnap((45 * Math.PI) / 180)
    controls.current.setScaleSnap(0.5)

    const helper = controls.current.getHelper()
    helper.name = 'TransformHelper'
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
    controls,
    canvas,
    currentTool,
    orbitMap,
    scene,
    setObjectVersion
  ])
}
