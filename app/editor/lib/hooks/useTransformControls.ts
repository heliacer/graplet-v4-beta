import { useEffect } from 'react'
import { useEditorRefs } from '../EditorContext'
import { TransformControls } from 'three/examples/jsm/Addons.js'
import { isInternalObject, isTransformControlsMode } from '../utils/three'
import { useCurrentObject } from './useCurrentObject'
import { useEditorStore } from '../state'

export function useTransformControls() {
  const { scene, canvas, orbitMap, controls, setObjectVersion } = useEditorRefs()
  const isRunning = useEditorStore(s => s.isRunning)
  const currentTool = useEditorStore(s => s.currentTool)
  const camera = useEditorStore(s => s.camera)
  const object = useCurrentObject()

  useEffect(() => {
    if (!camera || !canvas.current) return

    const dragListener = (e: { value: unknown }) => {
      const orbit = orbitMap.current.get(camera.id)
      if (orbit) orbit.enabled = !e.value
    }

    const changeListener = () => setObjectVersion(v => v + 1)

    /** init transformcontrols */
    if (!controls.current) {
      const cs = new TransformControls(camera, canvas.current)
      cs.setTranslationSnap(0.5)
      cs.setRotationSnap((45 * Math.PI) / 180)
      cs.setScaleSnap(1)

      const helper = cs.getHelper()
      helper.name = 'TransformHelper'
      scene.current.add(helper)

      cs.addEventListener('dragging-changed', dragListener)
      cs.addEventListener('change', changeListener)

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
      controls.current.removeEventListener('dragging-changed', dragListener)
      controls.current.removeEventListener('change', changeListener)
    }

    function cleanup() {
      controls.current?.detach()
      controls.current?.removeEventListener('dragging-changed', dragListener)
      controls.current?.removeEventListener('change', changeListener)
    }

    return cleanup
  }, [
    object,
    camera,
    controls,
    canvas,
    currentTool,
    orbitMap,
    isRunning,
    scene,
    setObjectVersion
  ])
}
