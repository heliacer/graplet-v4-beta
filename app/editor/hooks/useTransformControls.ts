import { useEffect } from 'react'
import { useEditorRefs } from '../context/EditorContext'
import { getObject, isTransformControlsMode } from '../utils/three'
import { useEditorStore } from '../state'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'

export function useTransformControls() {
  const { objectsRef, canvasRef, cameraRef, orbitMapRef, controlsRef } =
    useEditorRefs()

  const isRunning = useEditorStore(s => s.isRunning)
  const selectedItems = useEditorStore(s => s.selectedItems)
  const currentTool = useEditorStore(s => s.currentTool)
  const objectSnapping = useEditorStore(s => s.objectSnapping)
  const setObjectSnapping = useEditorStore(s => s.setObjectSnapping)
  const updateSnapshot = useEditorStore(s => s.updateSnapshot)

  useEffect(() => {
    if (!controlsRef.current) return
    controlsRef.current.setTranslationSnap(objectSnapping.translate)
    controlsRef.current.setScaleSnap(objectSnapping.scale)
    controlsRef.current.setRotationSnap((objectSnapping.rotate * Math.PI) / 180)
  }, [objectSnapping, controlsRef])

  useEffect(() => {
    const object =
      selectedItems.length > 0 ? getObject(objectsRef, selectedItems[0]) : null

    if (!cameraRef.current || !canvasRef.current) return
    if (!controlsRef.current) {
      controlsRef.current = new TransformControls(
        cameraRef.current,
        canvasRef.current
      )
      controlsRef.current.setTranslationSnap(0.5)
      controlsRef.current.setRotationSnap((45 * Math.PI) / 180)
      controlsRef.current.setScaleSnap(1)
      setObjectSnapping('translate', 0.5)
      setObjectSnapping('rotate', 45)
      setObjectSnapping('scale', 1)

      const onDraggingChanged = (e: { value: unknown }) => {
        if (!cameraRef.current) return
        const orbit = orbitMapRef.current.get(cameraRef.current.id)
        if (orbit) orbit.enabled = !e.value
      }

      const onChange = () => {
        if (object) {
          updateSnapshot(selectedItems[0], prev => {
            const { position, rotation, scale } = object
            return {
              ...prev,
              position: [position.x, position.y, position.z],
              rotation: [rotation.x, rotation.y, rotation.z],
              scale: [scale.x, scale.y, scale.z]
            }
          })
        }
      }

      controlsRef.current.addEventListener(
        'dragging-changed',
        onDraggingChanged
      )
      controlsRef.current.addEventListener('mouseUp', onChange)

      const scene = getObject(objectsRef, 'scene')
      scene.add(controlsRef.current.getHelper())
    }

    const shouldAttach =
      !isRunning && object && isTransformControlsMode(currentTool)

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
    cameraRef,
    currentTool,
    isRunning,
    objectsRef,
    canvasRef,
    controlsRef,
    orbitMapRef,
    selectedItems,
    setObjectSnapping,
    updateSnapshot
  ])
}
