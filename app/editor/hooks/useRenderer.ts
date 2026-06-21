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
import { getObject } from '../utils/three'

export function useRenderer(panelApi: DockviewPanelApi) {
  const { objectsRef, canvasRef, cameraRef, orbitMapRef } = useEditorRefs()
  const setHoveredItem = useEditorStore(s => s.setHoveredItem)
  const isRunning = useEditorStore(s => s.isRunning)
  const treeVersion = useEditorStore(s => s.treeVersion)

  const rendererRef = useRef<WebGLRenderer | null>(null)
  const helperRef = useRef<ViewHelper | null>(null)
  const raycasterRef = useRef(new Raycaster(undefined, undefined, 5, 25))
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
    const camera = cameraRef.current
    if (!camera) return
    const canvas = canvasRef.current

    /** WebGLRenderer init */
    if (!rendererRef.current) {
      const renderer = new WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
      })
      renderer.autoClear = false
      renderer.setClearColor(0x000000, 0)
      renderer.setPixelRatio(window.devicePixelRatio)
      rendererRef.current = renderer

      const helper = new ViewHelper(camera, renderer.domElement)
      helperRef.current = helper

      renderer.setAnimationLoop(render)
      onResize()
    }

    function render() {
      const camera = cameraRef.current
      if (!camera) return
      const renderer = rendererRef.current
      if (!renderer) return

      const orbitControls = orbitMapRef.current.get(camera.id)
      if (orbitControls !== undefined) {
        orbitControls.update()
      }

      renderer.clear()

      const helper = helperRef.current
      if (helper) {
        helper.render(renderer)
      }

      const isRunning = useEditorStore.getState().isRunning
      if (!isRunning && needsRaycastRef.current) {
        needsRaycastRef.current = false
        const raycaster = raycasterRef.current
        raycaster.setFromCamera(pointerRef.current, camera)
        const objects = objectsArrayRef.current
        const intersects = raycaster.intersectObjects(objects, false)
        const hit = intersects[0]
        const sharedId = hit?.object?.sharedId
        const current = useEditorStore.getState().hoveredItem
        const selectedItems = useEditorStore.getState().selectedItems
        const next = sharedId === undefined ? null : sharedId
        const isSelected = next && selectedItems.includes(next)
        if (current !== next && !isSelected) setHoveredItem(next)
      }

      const scene = getObject(objectsRef, 'scene')
      renderer.render(scene, camera)
    }

    function onResize() {
      const renderer = rendererRef.current
      if (!renderer) return
      const { clientWidth: w, clientHeight: h } = canvas
      renderer.setSize(w, h, false)
      const aspect = w / h

      if (cameraRef.current instanceof PerspectiveCamera) {
        cameraRef.current.aspect = aspect
        cameraRef.current.updateProjectionMatrix()
      }
      if (cameraRef.current instanceof OrthographicCamera) {
        const zoom = cameraRef.current.zoom
        const halfH = 6 / zoom
        const halfW = aspect * halfH
        Object.assign(cameraRef.current, {
          left: -halfW,
          right: halfW,
          top: halfH,
          bottom: -halfH
        })
        cameraRef.current.updateProjectionMatrix()
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

    const resizeListener = panelApi.onDidDimensionsChange(onResize)
    canvas.addEventListener('mousemove', onPointerMove)

    return () => {
      rendererRef.current?.setAnimationLoop(null)
      rendererRef.current?.dispose()
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
    rendererRef,
    setHoveredItem
  ])
}
