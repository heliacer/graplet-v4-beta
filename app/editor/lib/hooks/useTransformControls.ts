import { useEffect } from 'react'
import { useEditor } from '../EditorContext'
import { TransformControls } from 'three/examples/jsm/Addons.js'
import { isInternalObject, isTransformControlsMode } from '../utils/three'
import { useCurrentObject } from './useCurrentObject'
import { useObjectActions } from './useObjectActions'

export function useTransformControls() {
  const {
    scene,
    canvas,
    camera,
    orbitMap,
    currentTool,
    isRunning,
    controls,
    setObjectVersion
  } = useEditor()
  const object = useCurrentObject()
  const { bump } = useObjectActions()

  useEffect(() => {
    if (!camera || !canvas.current) return

    /** init transformcontrols */
    if (!controls.current) {
      const cs = new TransformControls(camera, canvas.current)
      cs.setTranslationSnap(0.5)
      cs.setRotationSnap((45 * Math.PI) / 180)
      cs.setScaleSnap(1)

      const helper = cs.getHelper()
      helper.name = 'TransformHelper'
      scene.current.add(helper)

      cs.addEventListener('dragging-changed', e => {
        const orbit = orbitMap.current.get(camera.id)
        if (orbit) orbit.enabled = !e.value
      })
      cs.addEventListener('change', bump)

      controls.current = cs
    }

    if (
      object &&
      !isInternalObject(object) &&
      !isRunning &&
      isTransformControlsMode(currentTool)
    ) {
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
    isRunning,
    scene,
    setObjectVersion,
    bump
  ])
}
