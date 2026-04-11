import { useEffect, useRef } from 'react'
import { TransformControls } from 'three/examples/jsm/Addons.js'
import { useEditorRefs } from '../context'
import { isInternalObject, isTransformControlsMode } from '../utils/three'
import { useCurrentObject } from './useCurrentObject'
import { useEditorStore } from '../state'

export function useTransformControls() {
  const { scene, canvas, orbitMap, controls } = useEditorRefs()

  const isRunning = useEditorStore(s => s.isRunning)
  const currentTool = useEditorStore(s => s.currentTool)
  const objectSnapping = useEditorStore(s => s.objectSnapping)
  const setObjectSnapping = useEditorStore(s => s.setObjectSnapping)
  const camera = useEditorStore(s => s.camera)
  const object = useCurrentObject()
  const objectRef = useRef(object)

  const invalidateObject = useEditorStore(s => s.invalidateObject)

  useEffect(() => {
    objectRef.current = object
  }, [object])

  useEffect(() => {
    if (!controls.current) return
    controls.current.setTranslationSnap(objectSnapping.translate)
    controls.current.setScaleSnap(objectSnapping.scale)
    controls.current.setRotationSnap((objectSnapping.rotate * Math.PI) / 180)
  }, [objectSnapping, controls])

  useEffect(() => {
    if (!camera || !canvas.current) return
    if (!controls.current) {
      controls.current = new TransformControls(camera, canvas.current)
      controls.current.setTranslationSnap(0.5)
      controls.current.setRotationSnap((45 * Math.PI) / 180)
      controls.current.setScaleSnap(1)
      setObjectSnapping('translate', 0.5)
      setObjectSnapping('rotate', 45)
      setObjectSnapping('scale', 1)

      const onDraggingChanged = (e: { value: unknown }) => {
        const orbit = orbitMap.current.get(camera.id)
        if (orbit) orbit.enabled = !e.value
      }

      const onChange = () => {
        const obj = objectRef.current
        if (obj) invalidateObject(obj)
      }

      controls.current.addEventListener('dragging-changed', onDraggingChanged)
      controls.current.addEventListener('mouseUp', onChange)

      scene.current.add(controls.current.getHelper())
    }

    const shouldAttach =
      object &&
      !isInternalObject(object) &&
      !isRunning &&
      isTransformControlsMode(currentTool)

    if (shouldAttach) {
      controls.current.attach(object)
      controls.current.setMode(currentTool)
    } else {
      controls.current.detach()
    }

    return () => {
      controls.current?.detach()
    }
  }, [
    camera,
    currentTool,
    isRunning,
    object,
    canvas,
    controls,
    orbitMap,
    scene,
    invalidateObject,
    setObjectSnapping
  ])
}
