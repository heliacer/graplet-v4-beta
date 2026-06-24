import { useEffect, useRef } from 'react'
import { useEditorStore } from '../state'
import { useEditorRefs } from '../context/EditorContext'
import { getObject, resolveToLevel } from '../utils/three'
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
import { TransformControls } from 'three/addons/controls/TransformControls.js'

/** 
 * @todo (#34) Scene UX Controls
 * need to completely redo this, (next to useRenderer), it's shit
 * -> refactor
 * -> also needs better structure
*/

export function collectMeshes(object: Object3D): Mesh[] {
  if (object instanceof Mesh) return [object]
  const meshes: Mesh[] = []
  object.traverse(child => {
    if (child instanceof Mesh) meshes.push(child)
  })
  return meshes
}

function buildOutlineGeometry(meshes: Mesh[]): BufferGeometry {
  if (meshes.length === 1) return new EdgesGeometry(meshes[0].geometry, 1)

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

function applyOutline(
  outline: LineSegments<BufferGeometry, LineBasicMaterial>,
  meshes: Mesh[],
  color: number
) {
  if (meshes.length === 0) {
    outline.visible = false
    return
  }

  meshes.forEach(m => m.updateWorldMatrix(true, false))
  outline.material.color.set(color)
  outline.geometry.dispose()
  outline.geometry = buildOutlineGeometry(meshes)

  if (meshes.length === 1) {
    outline.matrix.copy(meshes[0].matrixWorld)
  } else {
    outline.matrix.identity()
  }

  outline.visible = true
}

function createOutline(color: number) {
  const outline = new LineSegments(
    new EdgesGeometry(),
    new LineBasicMaterial({ color, depthTest: false })
  )
  outline.renderOrder = 999
  outline.visible = false
  outline.matrixAutoUpdate = false
  return outline
}

function createBoxHelper() {
  const el = document.createElement('div')
  el.style.cssText = `
    position: fixed;
    border: 1px dashed #00ff00;
    pointer-events: none;
    display: none;
    z-index: 9999;
  `
  document.body.appendChild(el)

  return {
    update(x1: number, y1: number, x2: number, y2: number, bounds: DOMRect) {
      const left = Math.max(Math.min(x1, x2), bounds.left)
      const top = Math.max(Math.min(y1, y2), bounds.top)
      const right = Math.min(Math.max(x1, x2), bounds.right)
      const bottom = Math.min(Math.max(y1, y2), bounds.bottom)
      el.style.left = `${left}px`
      el.style.top = `${top}px`
      el.style.width = `${Math.max(0, right - left)}px`
      el.style.height = `${Math.max(0, bottom - top)}px`
      el.style.display = 'block'
    },
    hide() {
      el.style.display = 'none'
    },
    dispose() {
      el.remove()
    }
  }
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
  const selectedItems = useEditorStore(s => s.selectedItems)
  const activeLevelId = useEditorStore(s => s.activeLevelId)
  const setSelectedItems = useEditorStore(s => s.setSelectedItems)
  const setHoveredItem = useEditorStore(s => s.setHoveredItem)

  /** Hover and box-select preview (cyan). Hidden when items are selected. */
  const hoverOutlineRef = useRef<LineSegments<
    BufferGeometry,
    LineBasicMaterial
  > | null>(null)

  /** Permanent selection (yellow). Stays during transform drag. */
  const selectionOutlineRef = useRef<LineSegments<
    BufferGeometry,
    LineBasicMaterial
  > | null>(null)

  /**
   * We can't attach the objectChange listener at effect setup time since
   * TransformControls is lazily created in useTransformControls. We store
   * the controls instance we've already attached to, for cleanup.
   */
  const attachedControlsRef = useRef<TransformControls | null>(null)

  const isDraggingRef = useRef(false)
  const dragCandidateRef = useRef(false)
  const dragStartRef = useRef({ x: 0, y: 0 })
  const lastBoxHitsRef = useRef<string[]>([])

  useEffect(() => {
    const scene = getObject(objectsRef, 'scene') as Scene
    const canvas = canvasRef.current

    const hoverOutline = createOutline(0x0000ff)
    const selectionOutline = createOutline(0xffff00)
    scene.add(hoverOutline)
    scene.add(selectionOutline)
    hoverOutlineRef.current = hoverOutline
    selectionOutlineRef.current = selectionOutline

    let selectionBox: SelectionBox | null = null
    const boxHelper = createBoxHelper()

    function updateSelectionOutline() {
      const outline = selectionOutlineRef.current
      if (!outline) return
      const ids = useEditorStore.getState().selectedItems
      const meshes = ids.flatMap(id => collectMeshes(getObject(objectsRef, id)))
      applyOutline(outline, meshes, 0xffff00)
    }

    function ensureControlsListener() {
      const controls = controlsRef.current
      if (attachedControlsRef.current || !controls) return
      controls.addEventListener('objectChange', updateSelectionOutline)
      attachedControlsRef.current = controls
    }

    function onPointerDown(event: MouseEvent) {
      ensureControlsListener()

      if (event.button === 2) return
      const currentTool = useEditorStore.getState().currentTool
      if (controlsRef.current?.axis || currentTool === 'move') return

      const hoveredItem = useEditorStore.getState().hoveredItem
      if (hoveredItem) {
        if (event.shiftKey) {
          const current = useEditorStore.getState().selectedItems
          setSelectedItems(
            current.includes(hoveredItem) ? current : [...current, hoveredItem]
          )
        } else {
          setSelectedItems([hoveredItem])
        }
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

      if (!selectionBox) selectionBox = new SelectionBox(camera, scene)
      selectionBox.camera = camera

      const rect = canvas.getBoundingClientRect()
      const start = toNDC(dragStartRef.current.x, dragStartRef.current.y, rect)
      const end = toNDC(event.clientX, event.clientY, rect)

      selectionBox.startPoint.set(start.x, start.y, 0.5)
      selectionBox.endPoint.set(end.x, end.y, 0.5)

      const level = getObject(
        objectsRef,
        useEditorStore.getState().activeLevelId
      )

      /** Resolve each hit to its direct-child-of-level sharedId, dedup.*/
      const ids = [
        ...new Set(
          selectionBox
            .select()
            .map(o => resolveToLevel(o, level))
            .filter((id): id is string => id !== undefined)
        )
      ]

      lastBoxHitsRef.current = ids

      const meshes = ids.flatMap(id => collectMeshes(getObject(objectsRef, id)))
      applyOutline(hoverOutline, meshes, 0x0000ff)
      selectionOutline.visible = false

      boxHelper.update(
        dragStartRef.current.x,
        dragStartRef.current.y,
        event.clientX,
        event.clientY,
        canvas.getBoundingClientRect()
      )
    }

    function onPointerUp(event: MouseEvent) {
      if (isDraggingRef.current) {
        const ids = lastBoxHitsRef.current
        if (event.shiftKey) {
          const current = useEditorStore.getState().selectedItems
          setSelectedItems([...new Set([...current, ...ids])])
        } else {
          setSelectedItems(ids)
        }
        hoverOutline.visible = false
      } else if (dragCandidateRef.current && !event.shiftKey) {
        setSelectedItems([])
      }

      isDraggingRef.current = false
      dragCandidateRef.current = false
      lastBoxHitsRef.current = []
      boxHelper.hide()
    }

    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)

    return () => {
      scene.remove(hoverOutline)
      scene.remove(selectionOutline)
      hoverOutline.geometry.dispose()
      hoverOutline.material.dispose()
      selectionOutline.geometry.dispose()
      selectionOutline.material.dispose()
      hoverOutlineRef.current = null
      selectionOutlineRef.current = null
      attachedControlsRef.current?.removeEventListener(
        'objectChange',
        updateSelectionOutline
      )
      attachedControlsRef.current = null
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      boxHelper.dispose()
    }
  }, [
    canvasRef,
    objectsRef,
    cameraRef,
    setHoveredItem,
    setSelectedItems,
    controlsRef
  ])

  /** Hover outline: only when nothing is selected and not mid-drag */
  useEffect(() => {
    const outline = hoverOutlineRef.current
    if (!outline) return

    if (selectedItems.length > 0 || isDraggingRef.current || !hoveredItem) {
      outline.visible = false
      return
    }

    const meshes = collectMeshes(getObject(objectsRef, hoveredItem))
    applyOutline(outline, meshes, 0x0000ff)
  }, [hoveredItem, selectedItems, objectsRef])

  /**
   * Selection outline: redraws on selection change.
   * Transform drag updates go through the objectChange listener set up in the effect above.
   */
  useEffect(() => {
    const outline = selectionOutlineRef.current
    if (!outline) return
    const meshes = selectedItems.flatMap(id =>
      collectMeshes(getObject(objectsRef, id))
    )
    applyOutline(outline, meshes, 0xffff00)
  }, [selectedItems, objectsRef, activeLevelId])
}
