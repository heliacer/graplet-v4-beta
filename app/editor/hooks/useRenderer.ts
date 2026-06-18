import {
  Camera,
  OrthographicCamera,
  PerspectiveCamera,
  WebGLRenderer
} from 'three'
import { useEditorRefs } from '../context/EditorContext'
import { useEffect, useRef } from 'react'
import { DockviewPanelApi } from 'dockview-react'
import { useEditorStore } from '../state'
import { ViewHelper } from 'three/examples/jsm/helpers/ViewHelper.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { getObject } from '../utils/three'

export function useRenderer(panelApi: DockviewPanelApi) {
  const { objectsRef, canvasRef, cameraRef, orbitMapRef } = useEditorRefs()
  const isRunning = useEditorStore(s => s.isRunning)
  const rendererRef = useRef<WebGLRenderer | null>(null)

  useEffect(() => {
    if (!cameraRef.current) return
    const scene = getObject(objectsRef, 'scene')

    const renderer = new WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true
    })
    renderer.autoClear = false
    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(window.devicePixelRatio)
    rendererRef.current = renderer

    const helper = new ViewHelper(cameraRef.current, renderer.domElement)

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = canvasRef.current
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

    resize()

    function render(camera: Camera, orbit?: OrbitControls | null) {
      orbit?.update()
      renderer.clear()
      helper.render(renderer)
      renderer.render(scene, camera)
    }

    const orbit = orbitMapRef.current.get(cameraRef.current.id)
    if (isRunning) {
      helper.visible = false
      renderer.setAnimationLoop(() => {
        if (!cameraRef.current) return
        render(cameraRef.current, orbit)
      })
    } else {
      helper.visible = true
      renderer.setAnimationLoop(() => {
        if (!cameraRef.current) return
        render(cameraRef.current, orbit)
      })
    }

    const resizeListener = panelApi.onDidDimensionsChange(resize)

    function cleanup() {
      renderer.setAnimationLoop(null)
      renderer.dispose()
      resizeListener.dispose()
      rendererRef.current = null
    }

    return cleanup
  }, [canvasRef, objectsRef, cameraRef, panelApi, orbitMapRef, isRunning])
}
