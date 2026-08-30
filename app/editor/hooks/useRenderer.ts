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
import { ObjectError } from '../types'

/**
 * @todo (#34) Scene UX Controls
 * -> need proper structure, revamp and clean up
 */

export function useRenderer(panelApi: DockviewPanelApi) {
  /** all refs used */
  const { objectsRef, canvasRef, cameraRef, orbitMapRef, controlsRef } =
    useEditorRefs()

  /** used in the outline later */
  const setHoveredItem = useEditorStore(s => s.setHoveredItem)

  /** used for skipping raycasting / set hover on move mode, as no outline selecting is needed  */
  const currentTool = useEditorStore(s => s.currentTool)

  /** when running, it is entirely skipped */
  const isRunning = useEditorStore(s => s.isRunning)

  /** triggers update when object added/removed, so targets need an update */
  const treeVersion = useEditorStore(s => s.treeVersion)

  /** snapshots to be raycasted, on the actively selected layer */
  const targetIds = useEditorStore(
    s => s.objectSnapshots[s.activeLevelId].childIds
  )

  /** targets ready for raycasting */
  const raycastTargetsRef = useRef<Object3D[]>([])

  const rendererRef = useRef<WebGLRenderer | null>(null)
  const raycasterRef = useRef(new Raycaster(undefined, undefined))

  /** octahedral "orientation" viewhelper, shows 3 colors and stuff */
  const helperRef = useRef<ViewHelper | null>(null)

  /** used for raycasting the exact pointer */
  const pointerRef = useRef(new Vector2())

  /** triggered only when pointer changes */
  const needsRaycastRef = useRef(false)

  /** when running, make the octahedral viewhelper invisible */
  useEffect(() => {
    const helper = helperRef.current
    if (!helper) return
    helper.visible = !isRunning
  }, [isRunning])

  /**
   * update targets for raycasting
   * -> @todo bug when resetting dockview: object not found error
   */
  useEffect(() => {
    raycastTargetsRef.current = targetIds.map(sharedId =>
      getObject(objectsRef, sharedId)
    )
  }, [objectsRef, treeVersion, targetIds])

  useEffect(() => {
    const canvas = canvasRef.current
    
    const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.autoClear = false

    /** transparent bg */
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

      /** editor always has some sort of orbit controls */
      const orbitControls = orbitMapRef.current.get(camera.id)
      orbitControls?.update()

      renderer.clear()
      helperRef.current.render(renderer)

      /** freshly get the isrunning and hovereditem state */
      const { isRunning, hoveredItem } = useEditorStore.getState()
      const axisActive = !!controlsRef.current?.axis

      /** only update raycasting if the controls aren't being used atm, and it isn't the move tool (skipped) */
      if (axisActive || currentTool === 'move') {
        if (hoveredItem !== null) setHoveredItem(null)

        /** if running, skipped entirely, and only if the pointer did update */
      } else if (!isRunning && needsRaycastRef.current) {
        needsRaycastRef.current = false
        const raycaster = raycasterRef.current
        raycaster.setFromCamera(pointerRef.current, camera)
        const intersects = raycaster.intersectObjects(
          raycastTargetsRef.current,
          false
        )

        const hit = intersects[0]
        if (hit) {
          const object = hit.object
          if (!object.sharedId) {
            throw new ObjectError(object, 'does not have a sharedId')
          }
          if (hoveredItem !== object.sharedId) {
            setHoveredItem(object.sharedId)
          }
        } else {
          if (hoveredItem !== null) {
            setHoveredItem(null)
          }
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
