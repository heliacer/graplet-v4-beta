import { OrthographicCamera, PerspectiveCamera, WebGLRenderer } from 'three'
import { useEditor } from '../../lib/EditorContext'
import { useEffect, useRef } from 'react'
import { DockviewPanelApi } from 'dockview-react'
import { ViewHelper } from 'three/examples/jsm/Addons.js'

export function useRenderer(panelApi: DockviewPanelApi) {
  const { scene, camera, canvas, orbitMap } = useEditor()
  const rendererRef = useRef<WebGLRenderer | null>(null)

  useEffect(() => {
    if (!camera) return

    const renderer = new WebGLRenderer({
      canvas: canvas.current,
      antialias: true,
      alpha: true
    })
    renderer.autoClear = false
    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(window.devicePixelRatio)
    rendererRef.current = renderer

    const helper = new ViewHelper(camera, renderer.domElement)

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = canvas.current
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

    renderer.setAnimationLoop(() => {
      orbitMap.current.get(camera.id)?.update()
      renderer.clear()
      renderer.render(scene.current, camera)
      helper.render(renderer)
    })

    const resizeListener = panelApi.onDidDimensionsChange(resize)

    return () => {
      renderer.setAnimationLoop(null)
      renderer.dispose()
      resizeListener.dispose()
      rendererRef.current = null
    }
  }, [canvas, scene, camera, panelApi, orbitMap])
}
