import { useEffect, useRef } from 'react'
import { useEditorRefs } from '../context/EditorContext'
import { TransformControls } from 'three/addons/controls/TransformControls.js'
import { useEditorStore } from '../state'
import { getObject } from '../utils/three'
import { Object3D } from 'three'
import { ObjectError } from '../types'

export function useTransformControls() {
  const { controlsRef, cameraRef, canvasRef, objectsRef } = useEditorRefs()
  const updateSnapshot = useEditorStore(s => s.updateSnapshot)
  const selectedItem = useEditorStore(s => s.selectedItems[0])
  const currentTool = useEditorStore(s => s.currentTool)
  const objectSnapping = useEditorStore(s => s.objectSnapping)
  const objectRef = useRef<Object3D | null>(null)

  useEffect(() => {
    if (!cameraRef.current || !canvasRef.current) return

    /** TransformControls init */
    if (!controlsRef.current) {
      const controls = new TransformControls(
        cameraRef.current,
        canvasRef.current
      )

      controls.setTranslationSnap(0.5)
      controls.setRotationSnap((45 * Math.PI) / 180)
      controls.setScaleSnap(1)

      const scene = getObject(objectsRef, 'scene')
      scene.add(controls.getHelper())

      controls.addEventListener('mouseUp', handleUpdate)
      controlsRef.current = controls
    }

    /** Attach / detach */
    const controls = controlsRef.current
    const isTransformTool =
      currentTool === 'translate' ||
      currentTool === 'rotate' ||
      currentTool === 'scale'

    if (!isTransformTool || selectedItem === undefined) {
      controls.detach()
      objectRef.current = null
      return
    }

    controls.setMode(currentTool)
    controls.setTranslationSnap(objectSnapping.translate)
    controls.setRotationSnap((objectSnapping.rotate * Math.PI) / 180)
    controls.setScaleSnap(objectSnapping.scale)
    const object = getObject(objectsRef, selectedItem)
    objectRef.current = object
    controls.attach(object)

    function handleUpdate() {
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
  }, [
    cameraRef,
    canvasRef,
    controlsRef,
    currentTool,
    objectSnapping,
    updateSnapshot,
    objectsRef,
    selectedItem
  ])
}
