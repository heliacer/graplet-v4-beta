import {
  Mesh,
  Object3D,
  OrthographicCamera,
  PerspectiveCamera,
  Raycaster,
  Vector2,
  WebGLRenderer
} from 'three'
import { useEditorRefs } from '../context/EditorContext'
import { useEffect, useRef } from 'react'
import { DockviewPanelApi } from 'dockview-react'
import { useEditorStore } from '../state'
import { ViewHelper } from 'three/examples/jsm/helpers/ViewHelper.js'
import { getObject } from '../utils/three'

export function useRenderer(panelApi: DockviewPanelApi) {
  const { objectsRef, canvasRef, cameraRef, orbitMapRef, controlsRef } =
    useEditorRefs()
  const setHoveredItem = useEditorStore(s => s.setHoveredItem)
  const currentTool = useEditorStore(s => s.currentTool)
  const isRunning = useEditorStore(s => s.isRunning)
  const treeVersion = useEditorStore(s => s.treeVersion)
  const activeLevelId = useEditorStore(s => s.activeLevelId)

  const rendererRef = useRef<WebGLRenderer | null>(null)
  const helperRef = useRef<ViewHelper | null>(null)
  const raycasterRef = useRef(new Raycaster(undefined, undefined))
  const pointerRef = useRef(new Vector2())
  const needsRaycastRef = useRef(false)

  /**
   * Flat array of raycastable meshes at the current selection level.
   * Each mesh maps back to a direct child's sharedId via raycastMapRef.
   * Rebuilt whenever the tree or active level changes.
   */
  const raycastTargetsRef = useRef<Object3D[]>([])
  const raycastMapRef = useRef<Map<string, string>>(new Map())

  useEffect(() => {
    const helper = helperRef.current
    if (!helper) return
    helper.visible = !isRunning
  }, [isRunning])

  useEffect(() => {
    const level = objectsRef.current.get(activeLevelId)
    if (!level) return

    const targets: Object3D[] = []
    const map = new Map<string, string>()

    for (const child of level.children) {
      const sharedId = child.sharedId
      if (sharedId === undefined) continue

      /**
       * Traverse to collect all mesh descendants of this child
       * Cameras, lights, groups, all resolve to the child's sharedId
       */
      child.traverse(o => {
        if (o instanceof Mesh) {
          targets.push(o)
          map.set(o.uuid, sharedId)
        }
      })
    }

    raycastTargetsRef.current = targets
    raycastMapRef.current = map
  }, [objectsRef, treeVersion, activeLevelId])

  useEffect(() => {
    const canvas = canvasRef.current

    const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.autoClear = false
    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(window.devicePixelRatio)
    rendererRef.current = renderer

    function render() {
      const camera = cameraRef.current
      const renderer = rendererRef.current
      if (!camera || !renderer) return

      if (!helperRef.current) {
        helperRef.current = new ViewHelper(camera, renderer.domElement)
        helperRef.current.visible = !useEditorStore.getState().isRunning
      }

      const orbitControls = orbitMapRef.current.get(camera.id)
      orbitControls?.update()

      renderer.clear()
      helperRef.current.render(renderer)

      const { isRunning, hoveredItem, selectedItems } =
        useEditorStore.getState()
      const axisActive = !!controlsRef.current?.axis

      if (axisActive || currentTool === 'move') {
        if (hoveredItem !== null) setHoveredItem(null)
      } else if (!isRunning && needsRaycastRef.current) {
        needsRaycastRef.current = false
        const raycaster = raycasterRef.current
        raycaster.setFromCamera(pointerRef.current, camera)
        const intersects = raycaster.intersectObjects(
          raycastTargetsRef.current,
          false
        )
        const hit = intersects[0]
        const next = hit
          ? (raycastMapRef.current.get(hit.object.uuid) ?? null)
          : null
        if (
          next !== hoveredItem &&
          (next === null || !selectedItems.includes(next))
        ) {
          setHoveredItem(next)
        }
      }

      const scene = getObject(objectsRef, 'scene')
      renderer.render(scene, camera)
    }

    function onResize() {
      const { clientWidth: w, clientHeight: h } = canvas
      renderer.setSize(w, h, false)
      const aspect = w / h

      const camera = cameraRef.current
      if (camera instanceof PerspectiveCamera) {
        camera.aspect = aspect
        camera.updateProjectionMatrix()
      }
      if (camera instanceof OrthographicCamera) {
        const zoom = camera.zoom
        const halfH = 6 / zoom
        const halfW = aspect * halfH
        Object.assign(camera, {
          left: -halfW,
          right: halfW,
          top: halfH,
          bottom: -halfH
        })
        camera.updateProjectionMatrix()
      }
    }

    function onPointerMove(event: MouseEvent) {
      needsRaycastRef.current = true
      const rect = canvas.getBoundingClientRect()
      pointerRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      pointerRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    }

    renderer.setAnimationLoop(render)
    onResize()

    const resizeListener = panelApi.onDidDimensionsChange(onResize)
    canvas.addEventListener('mousemove', onPointerMove)

    return () => {
      renderer.setAnimationLoop(null)
      renderer.dispose()
      helperRef.current?.dispose()
      resizeListener.dispose()
      canvas.removeEventListener('mousemove', onPointerMove)
      rendererRef.current = null
      helperRef.current = null
    }
  }, [
    panelApi,
    cameraRef,
    canvasRef,
    objectsRef,
    orbitMapRef,
    setHoveredItem,
    controlsRef,
    currentTool
  ])
}
