import { useEffect, useRef } from 'react'
import { useEditorStore } from '../state'
import { useEditorRefs } from '../context/EditorContext'
import { getObject } from '../utils/three'
import {
  Box3,
  BoxGeometry,
  BufferGeometry,
  EdgesGeometry,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  Object3D,
  Scene,
  Vector3
} from 'three'
import { SelectionBox } from 'three/examples/jsm/interactive/SelectionBox.js'

type SelectableMesh = Mesh & { sharedId?: string }

function buildOutlineGeometry(meshes: Mesh[]): BufferGeometry {
  if (meshes.length === 1) {
    return new EdgesGeometry(meshes[0].geometry, 1)
  }

  const box = new Box3()
  for (const m of meshes) box.expandByObject(m)

  const size = new Vector3()
  const center = new Vector3()
  box.getSize(size)
  box.getCenter(center)

  const geo = new EdgesGeometry(new BoxGeometry(size.x, size.y, size.z))
  geo.translate(center.x, center.y, center.z)
  return geo
}

function collectMeshes(object: Object3D): Mesh[] {
  if (object instanceof Mesh) return [object]
  const meshes: Mesh[] = []
  object.traverse(child => {
    if (child instanceof Mesh) meshes.push(child)
  })
  return meshes
}

function applyOutline(
  outline: LineSegments<BufferGeometry, LineBasicMaterial>,
  meshes: Mesh[]
) {
  if (meshes.length === 0) {
    outline.visible = false
    return
  }

  meshes.forEach(m => m.updateWorldMatrix(true, false))

  outline.geometry.dispose()
  outline.geometry = buildOutlineGeometry(meshes)

  if (meshes.length === 1) {
    outline.matrix.copy(meshes[0].matrixWorld)
  } else {
    outline.matrix.identity()
  }

  outline.visible = true
}

function toNDC(clientX: number, clientY: number, rect: DOMRect) {
  return {
    x: ((clientX - rect.left) / rect.width) * 2 - 1,
    y: -((clientY - rect.top) / rect.height) * 2 + 1
  }
}

export function useOutline() {
  const { objectsRef, canvasRef, cameraRef, controlsRef } = useEditorRefs()
  const hoveredItem = useEditorStore(s => s.hoveredItem)
  const setSelectedItems = useEditorStore(s => s.setSelectedItems)
  const setHoveredItem = useEditorStore(s => s.setHoveredItem)

  const outlineRef = useRef<LineSegments<
    BufferGeometry,
    LineBasicMaterial
  > | null>(null)

  const isDraggingRef = useRef(false)
  const dragCandidateRef = useRef(false)
  const dragStartRef = useRef({ x: 0, y: 0 })
  const lastBoxHitsRef = useRef<SelectableMesh[]>([])

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

    let selectionBox: SelectionBox | null = null

    function onPointerDown(event: MouseEvent) {
      const currentTool = useEditorStore.getState().currentTool
      if (!['translate', 'rotate', 'scale'].includes(currentTool)) return
      if (event.button === 2) return
      if (controlsRef.current?.axis) return

      const hoveredItem = useEditorStore.getState().hoveredItem
      if (hoveredItem) {
        setSelectedItems([hoveredItem])
        setHoveredItem(null)
        return
      }

      dragCandidateRef.current = true
      dragStartRef.current = { x: event.clientX, y: event.clientY }
    }
    function onPointerMove(event: MouseEvent) {
      if (!dragCandidateRef.current) return

      if (!isDraggingRef.current) {
        const dx = event.clientX - dragStartRef.current.x
        const dy = event.clientY - dragStartRef.current.y
        if (Math.hypot(dx, dy) < 4) return
        isDraggingRef.current = true
      }

      const camera = cameraRef.current
      if (!camera) return

      if (!selectionBox) selectionBox = new SelectionBox(camera, scene as Scene)
      selectionBox.camera = camera

      const rect = canvas.getBoundingClientRect()
      const start = toNDC(dragStartRef.current.x, dragStartRef.current.y, rect)
      const end = toNDC(event.clientX, event.clientY, rect)

      selectionBox.startPoint.set(start.x, start.y, 0.5)
      selectionBox.endPoint.set(end.x, end.y, 0.5)

      const hits = selectionBox
        .select()
        .filter((o): o is SelectableMesh => o instanceof Mesh && !!o.sharedId)

      lastBoxHitsRef.current = hits
      const outline = outlineRef.current
      if (outline) applyOutline(outline, hits)
    }

    function onPointerUp() {
      if (isDraggingRef.current) {
        const ids = lastBoxHitsRef.current.map(m => m.sharedId!)
        setSelectedItems(ids)
      } else if (dragCandidateRef.current) {
        setSelectedItems([])
      }

      isDraggingRef.current = false
      dragCandidateRef.current = false
      lastBoxHitsRef.current = []

      const outline = outlineRef.current
      if (outline) outline.visible = false
    }
    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)

    return () => {
      scene.remove(outline)
      outline.geometry.dispose()
      outline.material.dispose()
      outlineRef.current = null
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [
    canvasRef,
    objectsRef,
    cameraRef,
    setHoveredItem,
    setSelectedItems,
    controlsRef
  ])

  useEffect(() => {
    const outline = outlineRef.current
    if (!outline || isDraggingRef.current) return

    if (!hoveredItem) {
      outline.visible = false
      return
    }

    const target = getObject(objectsRef, hoveredItem)
    const meshes = collectMeshes(target)

    if (meshes.length === 0) {
      outline.visible = false
      return
    }
    applyOutline(outline, meshes)
  }, [hoveredItem, objectsRef])
}
