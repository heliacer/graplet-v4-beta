import { useEffect, useRef } from 'react'
import { useEditorRefs } from '../context/EditorContext'
import { getObject, isTransformControlsMode } from '../utils/three'
import { useEditorStore } from '../state'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'
import { Object3D } from 'three'
import { ObjectError } from '../types'

export function useTransformControls() {
  /**
   * @todo support multiselect
   * 
   * -> maybe using three-multi-select
   */

  const { objectsRef, canvasRef, cameraRef, orbitMapRef, controlsRef } =
    useEditorRefs()
  const objectRef = useRef<null | Object3D>(null)

  const isRunning = useEditorStore(s => s.isRunning)
  const selectedItem = useEditorStore(s => s.selectedItems[0])
  const currentTool = useEditorStore(s => s.currentTool)
  const setObjectSnapping = useEditorStore(s => s.setObjectSnapping)
  const updateSnapshot = useEditorStore(s => s.updateSnapshot)
  const objectSnapping = useEditorStore(s => s.objectSnapping)

  useEffect(() => {
    if (!controlsRef.current) return
    controlsRef.current.setTranslationSnap(objectSnapping.translate)
    controlsRef.current.setScaleSnap(objectSnapping.scale)
    controlsRef.current.setRotationSnap((objectSnapping.rotate * Math.PI) / 180)
  }, [objectSnapping, controlsRef])

  useEffect(() => {
    objectRef.current =
      selectedItem !== undefined ? getObject(objectsRef, selectedItem) : null
  }, [selectedItem, objectsRef])

  useEffect(() => {
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
        const object = objectRef.current
        if (!object) return
        const sharedId = object.sharedId
        if (sharedId === undefined) {
          throw new ObjectError(object, 'does not have a sharedId')
        }
        const { position, rotation, scale } = object
        updateSnapshot(sharedId, prev => {
          return {
            ...prev,
            position: [position.x, position.y, position.z],
            rotation: [rotation.x, rotation.y, rotation.z],
            scale: [scale.x, scale.y, scale.z]
          }
        })
      }

      controlsRef.current.addEventListener(
        'dragging-changed',
        onDraggingChanged
      )
      controlsRef.current.addEventListener('mouseUp', onChange)

      const scene = getObject(objectsRef, 'scene')
      scene.add(controlsRef.current.getHelper())
    }

    if (
      !isRunning &&
      objectRef.current &&
      isTransformControlsMode(currentTool)
    ) {
      controlsRef.current.attach(objectRef.current)
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
    selectedItem,
    setObjectSnapping,
    updateSnapshot
  ])
}
