import { useEffect, useRef } from 'react'
import { useEditorStore } from '../state'
import { useEditorRefs } from '../context/EditorContext'
import { getObject } from '../utils/three'
import { EdgesGeometry, LineBasicMaterial, LineSegments, Mesh } from 'three'

export function useSelection() {
  const { objectsRef, canvasRef } = useEditorRefs()
  const hoveredItem = useEditorStore(s => s.hoveredItem)
  const setSelectedItems = useEditorStore(s => s.setSelectedItems)
  const setHoveredItem = useEditorStore(s => s.setHoveredItem)

  const outlineRef = useRef<LineSegments | null>(null)

  useEffect(() => {
    const outline = new LineSegments(
      new EdgesGeometry(),
      new LineBasicMaterial({
        color: 0x22bfa4,
        depthTest: false
      })
    )
    outline.renderOrder = 999
    outline.visible = false
    outline.matrixAutoUpdate = false

    const scene = getObject(objectsRef, 'scene')
    scene.add(outline)
    outlineRef.current = outline

    const canvas = canvasRef.current

    function onPointerDown(event: MouseEvent) {
      if (event.button === 2) return
      const hoveredItem = useEditorStore.getState().hoveredItem
      if (hoveredItem) {
        setSelectedItems([hoveredItem])
      } else {
      }
      setHoveredItem(null)
    }

    canvas.addEventListener('pointerdown', onPointerDown)

    return () => {
      scene.remove(outline)
      outline.geometry.dispose()
      outline.material.dispose()
      outlineRef.current = null
      canvas.removeEventListener('pointerdown', onPointerDown)
    }
  }, [canvasRef, objectsRef, setHoveredItem, setSelectedItems])

  useEffect(() => {
    const outline = outlineRef.current
    if (!outline) return

    if (!hoveredItem) {
      outline.visible = false
      return
    }

    const target = getObject(objectsRef, hoveredItem)
    if (!(target instanceof Mesh)) {
      outline.visible = false
      return
    }

    target.updateWorldMatrix(true, false)

    outline.geometry.dispose()
    outline.geometry = new EdgesGeometry(target.geometry, 1)
    outline.matrix.copy(target.matrixWorld)
    outline.visible = true
  }, [hoveredItem, objectsRef])
}
