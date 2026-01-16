import { useEffect } from 'react'
import { useEditor } from '../EditorContext'
import { TransformControls } from 'three/examples/jsm/Addons.js'
import { isInternalObject } from '../utils/three'
import { useCurrentObject } from './useCurrentObject'

export function useTransformControls() {
  const {
    scene,
    canvas,
    camera,
    orbitMap,
    currentTool,
    controls,
    setObjectVersion
  } = useEditor()
  const object = useCurrentObject()
  
  
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

      controls.current.addEventListener('dragging-changed', e => {
        const orbit = orbitMap.current.get(camera.id)
        if (orbit) orbit.enabled = !e.value
      })

      controls.current.addEventListener('change', () =>
        setObjectVersion(v => v + 1)
      )
    }

    if (object && !isInternalObject(object)) {
      controls.current.attach(object)
      controls.current.setMode(currentTool)
    } else {
      controls.current.detach()
    }

    return () => {
      controls.current?.detach()
    }
  }, [
    object,
    camera,
    controls,
    canvas,
    currentTool,
    orbitMap,
    scene,
    setObjectVersion,
  ])
}
