import { useEffect, useRef } from 'react'
import { useEditorRefs } from '../context/EditorContext'
import { isInternalObject, isTransformControlsMode } from '../utils/three'
import { useCurrentObject } from './useCurrentObject'
import { useEditorStore } from '../state'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'

export function useTransformControls() {
  const { sceneRef, canvasRef, orbitMapRef, controlsRef } = useEditorRefs()

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
    if (!controlsRef.current) return
    controlsRef.current.setTranslationSnap(objectSnapping.translate)
    controlsRef.current.setScaleSnap(objectSnapping.scale)
    controlsRef.current.setRotationSnap((objectSnapping.rotate * Math.PI) / 180)
  }, [objectSnapping, controlsRef])

  useEffect(() => {
    if (!camera || !canvasRef.current) return
    if (!controlsRef.current) {
      controlsRef.current = new TransformControls(camera, canvasRef.current)
      controlsRef.current.setTranslationSnap(0.5)
      controlsRef.current.setRotationSnap((45 * Math.PI) / 180)
      controlsRef.current.setScaleSnap(1)
      setObjectSnapping('translate', 0.5)
      setObjectSnapping('rotate', 45)
      setObjectSnapping('scale', 1)

      const onDraggingChanged = (e: { value: unknown }) => {
        const orbit = orbitMapRef.current.get(camera.id)
        if (orbit) orbit.enabled = !e.value
      }

      const onChange = () => {
        const obj = objectRef.current
        if (obj) invalidateObject(obj)
      }

      controlsRef.current.addEventListener(
        'dragging-changed',
        onDraggingChanged
      )
      controlsRef.current.addEventListener('mouseUp', onChange)

      sceneRef.current.add(controlsRef.current.getHelper())
    }

    const shouldAttach =
      object &&
      !isInternalObject(object) &&
      !isRunning &&
      isTransformControlsMode(currentTool)

    if (shouldAttach) {
      controlsRef.current.attach(object)
      controlsRef.current.setMode(currentTool)
    } else {
      controlsRef.current.detach()
    }

    return () => {
      controlsRef.current?.detach()
    }
  }, [
    camera,
    currentTool,
    isRunning,
    object,
    canvasRef,
    controlsRef,
    orbitMapRef,
    sceneRef,
    invalidateObject,
    setObjectSnapping
  ])
}
