import { useEffect, useRef } from 'react'
import { useEditorRefs } from '../context/EditorContext'
import { Raycaster, Vector2 } from 'three'
import { ObjectError } from '../types'
import { useEditorStore } from '../state'

export function useRaycaster() {
  const { canvasRef, cameraRef, objectsRef, controlsRef } = useEditorRefs()
  const setSelectedItems = useEditorStore(s => s.setSelectedItems)

  const raycasterRef = useRef(new Raycaster())
  const pointer = useRef(new Vector2())

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    function updatePointer(event: PointerEvent) {
      const rect = canvas.getBoundingClientRect()

      pointer.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1

      pointer.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    }

    function handlePointerDown(event: PointerEvent) {
      if (
        event.button === 2 ||
        !cameraRef.current ||
        controlsRef.current?.dragging
      )
        return
      updatePointer(event)
      const raycaster = raycasterRef.current
      raycaster.setFromCamera(pointer.current, cameraRef.current)

      const objects = Array.from(objectsRef.current.values())
      const hits = raycaster.intersectObjects(objects, false)
      if (hits.length > 0) {
        const object = hits[0].object
        const sharedId = object.sharedId
        if (sharedId === undefined) {
          throw new ObjectError(object, 'does not have a sharedId')
        }
        setSelectedItems([sharedId])
      } else {
        setSelectedItems([])
      }
    }

    canvas.addEventListener('pointerdown', handlePointerDown)

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [cameraRef, canvasRef, objectsRef, controlsRef, setSelectedItems])
}
