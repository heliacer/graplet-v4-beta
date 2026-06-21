import {
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
import { getObject, resolveSelectionTarget } from '../utils/three'

export function useRenderer(panelApi: DockviewPanelApi) {
  const { objectsRef, canvasRef, cameraRef, orbitMapRef, controlsRef } =
    useEditorRefs()
  const setHoveredItem = useEditorStore(s => s.setHoveredItem)
  const isRunning = useEditorStore(s => s.isRunning)
  const treeVersion = useEditorStore(s => s.treeVersion)

  const rendererRef = useRef<WebGLRenderer | null>(null)
  const helperRef = useRef<ViewHelper | null>(null)
  const raycasterRef = useRef(new Raycaster(undefined, undefined, 5, 200))
  const pointerRef = useRef(new Vector2())
  const needsRaycastRef = useRef(false)
  const objectsArrayRef = useRef<Object3D[]>([])

  useEffect(() => {
    const helper = helperRef.current
    if (!helper) return
    helper.visible = !isRunning
  }, [isRunning])

  useEffect(() => {
    objectsArrayRef.current = Array.from(objectsRef.current.values())
  }, [objectsRef, treeVersion])

  useEffect(() => {
    const canvas = canvasRef.current

    const renderer = new WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    })
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

      const isRunning = useEditorStore.getState().isRunning
      const currentTool = useEditorStore.getState().currentTool
      const axisActive = !!controlsRef.current?.axis

      if (['translate', 'rotate', 'scale'].includes(currentTool)) {
        if (axisActive) {
          if (useEditorStore.getState().hoveredItem !== null)
            setHoveredItem(null)
        } else if (!isRunning && needsRaycastRef.current) {
          needsRaycastRef.current = false
          const raycaster = raycasterRef.current
          raycaster.setFromCamera(pointerRef.current, camera)
          const objects = objectsArrayRef.current
          const intersects = raycaster.intersectObjects(objects, false)
          const hit = intersects[0]
          const sharedId = hit ? resolveSelectionTarget(hit.object) : undefined
          const current = useEditorStore.getState().hoveredItem
          const selectedItems = useEditorStore.getState().selectedItems
          const next = sharedId === undefined ? null : sharedId
          const isSelected = next && selectedItems.includes(next)
          if (current !== next && !isSelected) setHoveredItem(next)
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

      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      pointerRef.current.x = (x / rect.width) * 2 - 1
      pointerRef.current.y = -(y / rect.height) * 2 + 1
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
    controlsRef
  ])
}
