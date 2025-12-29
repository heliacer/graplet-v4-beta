import { useEffect } from 'react'
import { useEditor } from '../EditorContext'
import { TransformControls } from 'three/examples/jsm/Addons.js'
import { isInternalObject } from '../utils/three'

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
    if (!camera || !canvas.current) return

    /** init transformcontrols */
    if (!controls.current) {
      controls.current = new TransformControls(camera, canvas.current)

      controls.current.setTranslationSnap(0.5)
      controls.current.setRotationSnap((45 * Math.PI) / 180)
      controls.current.setScaleSnap(1)

      const helper = controls.current.getHelper()
      helper.name = 'TransformHelper'
      scene.current.add(helper)

      controls.current.addEventListener('dragging-changed', (e) => {
        const orbit = orbitMap.current.get(camera.id)
        if (orbit) orbit.enabled = !e.value
      })

      controls.current.addEventListener('change', () =>
        setObjectVersion((prev) => prev + 1)
      )
    }

    if (currentObject && !isInternalObject(currentObject)) {
      controls.current.attach(currentObject)
      controls.current.setMode(currentTool)
    } else {
      controls.current.detach()
    }

    return () => {
      controls.current?.detach()
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

  /** 
  @todo Figure out if this is really needed, since linter does not like it 

  useEffect(() => {
    return () => {
      if (controls.current) {
        scene.current?.remove(controls.current.getHelper())
        controls.current.dispose()
        controls.current = null
      }
    }
  }, [])
  */
}
