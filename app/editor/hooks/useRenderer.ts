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

export function useRenderer(panelApi: DockviewPanelApi) {
  const { sceneRef, canvasRef, orbitMapRef } = useEditorRefs()
  const isRunning = useEditorStore(s => s.isRunning)
  const camera = useEditorStore(s => s.camera)
  const rendererRef = useRef<WebGLRenderer | null>(null)

  useEffect(() => {
    if (!camera) return

    const renderer = new WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true
    })
    renderer.autoClear = false
    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(window.devicePixelRatio)
    rendererRef.current = renderer

    const helper = new ViewHelper(camera, renderer.domElement)

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = canvasRef.current
      renderer.setSize(w, h, false)
      const aspect = w / h

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

    resize()

    function render(camera: Camera, orbit?: OrbitControls | null) {
      orbit?.update()
      renderer.clear()
      helper.render(renderer)
      renderer.render(sceneRef.current, camera)
    }

    const orbit = orbitMapRef.current.get(camera.id)
    if (isRunning) {
      helper.visible = false
      renderer.setAnimationLoop(() => render(camera, orbit))
    } else {
      helper.visible = true
      renderer.setAnimationLoop(() => render(camera, orbit))
    }

    const resizeListener = panelApi.onDidDimensionsChange(resize)

    function cleanup() {
      renderer.setAnimationLoop(null)
      renderer.dispose()
      resizeListener.dispose()
      rendererRef.current = null
    }

    return cleanup
  }, [canvasRef, sceneRef, camera, panelApi, orbitMapRef, isRunning])
}
